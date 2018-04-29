import { stringify } from "qs"
import { ISheetData } from "./interfaces"
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
  id: string
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

  const getSheet = async (sheetId: string): Promise<ISheetData> => {
    const result = await request({
      url: `${sheetId}?${stringify({ includeGridData: true })}`
    })
    return result.json()
  }

  const copySheet = async (sheetId: string, title: string) => {
    const sheet = await getSheet(sheetId)
    if (sheet && sheet) {
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

  const dbManagement = (schema: ISchema, sheetData: ISheetData): IDBManger => {
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
      id: sheetData.spreadsheetId,
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
    const spreadSheet = await getSheet(sheetId)
    return dbManagement(options.schema, spreadSheet)
  }

  return {
    createDB,
    loadDB,
    copySheet,
    getSheet
  }
}
