import { stringify } from "qs"
export interface ISheetOptions {
  accessToken?: string
  makeRequest?: typeof fetch
}

export type EntityTypes = "string" | "number" | "date"
export interface ISchemaEntity {
  type: EntityTypes
  validate?: (value: any) => string
}
export interface ISchema {
  [key: string]: { [key: string]: ISchemaEntity }
}
export interface ICreatDBOptions {
  schema: ISchema
}
export interface IDBManger {
  getEntity: <T>(entityName: string) => IEntity<T>
}
export interface IEntity<T> {
  create: (entityFeilds: any) => Promise<T>
  read: (query: any) => Promise<T>
  update: (entityFeilds: any, query: any) => Promise<T>
  delete: (query: any) => Promise<string[]>
}
export default function initSheets({
  accessToken,
  makeRequest = fetch
}: ISheetOptions) {
  interface IRequestOptions {
    baseUrl?: string
    url?: string
    method?: "GET" | "PUT" | "POST" | "PATCH"
    body?: Object // tslint:disable-line
  }
  const request = ({
    baseUrl = "https://sheets.googleapis.com/v4/spreadsheets",
    url = "",
    method = "GET",
    body
  }: IRequestOptions = {}) =>
    makeRequest([baseUrl, url.replace(/^\//, "")].filter(i => i).join("/"), {
      body: body ? JSON.stringify(body) : undefined,
      headers: new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json"
      }),
      method
    })

  const getSheet = async (sheetId: string) => {
    const result = await request({
      url: `${sheetId}?${stringify({ includeGridData: true })}`
    })
    return result.json()
  }

  const copySheet = async (sheetId: string, title: string) => {
    const sheet = await getSheet(sheetId)
    if (sheet && sheet.body) {
      return request({
        body: {
          properties: {
            title
          },
          sheets: sheet.sheets
        },
        method: "POST"
      })
    }
  }

  const dbManagement = (schema: ISchema, sheetData: any): IDBManger => {
    const entityLookup = Object.keys(schema).reduce(
      (db, key) => {
        db[key] = {
          create: (entityFeilds: any) => null,
          read: (entityFeilds: any, query: any) => null,
          update: (entityFeilds: any, query: any) => null,
          delete: (query: any) => null
        } as any
        return db
      },
      {} as { [key: string]: IEntity<any> }
    )
    return {
      getEntity: <T>(key: string) => {
        if (!entityLookup[key]) throw new Error("no entity: " + key)
        return entityLookup[key] as IEntity<T>
      }
    }
  }

  const createDB = async (options: ICreatDBOptions) => {
    // create sheet
    return loadDB("", options)
  }
  const loadDB = async (sheetId: string, options: ICreatDBOptions) => {
    // load sheet
    return dbManagement(options.schema, "")
  }

  return {
    createDB,
    loadDB,
    copySheet,
    getSheet
  }
}
