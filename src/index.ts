import { stringify } from "qs"
import { ISheet, ISheetData, SheetType } from "./interfaces"
import logFactory, { LOG_LEVELS } from "./logger"
export interface ISheetOptions {
  accessToken: string
  makeRequest?: typeof fetch
  logLevel?: LOG_LEVELS
}

export type EntityTypes = "string" | "number" | "date"
export interface ISchemaEntity {
  type: EntityTypes
  validate?: (value: any) => string
}
export interface ISchema {
  [key: string]: { [key: string]: ISchemaEntity }
}
export interface ICreateDBOptions {
  schema: ISchema
  title: string
}
export interface IDBManger {
  id: string
  getEntity: <T>(entityName: string) => IEntity<T>
}
export interface IEntity<T> {
  _raw: () => ISheet
  create: (entityFeilds: any) => Promise<T>
  read: (query: any) => Promise<T>
  update: (entityFeilds: any, query: any) => Promise<T>
  delete: (query: any) => Promise<string[]>
}

export interface IRequestOptions {
  baseUrl?: string
  url?: string
  method?: "GET" | "PUT" | "POST" | "PATCH"
  body?: Object // tslint:disable-line
}

export default function initSheets({
  accessToken,
  makeRequest = fetch,
  logLevel = LOG_LEVELS.none
}: ISheetOptions) {
  const logger = logFactory(logLevel)
  const request = requestFactory({ accessToken, logger, makeRequest })
  const getSheet = getSheetFactory(request)
  const createSheet = createSheetFactory(request)
  const copySheet = copySheetFactory(request, getSheet, createSheet)

  const createDB = async (options: ICreateDBOptions) => {
    const sheets = schemaToEmptySheets(options.schema)
    const newSheet = await createSheet(options.title, { sheets })
    return loadDB(newSheet.spreadsheetId, options)
  }
  const loadDB = async (sheetId: string, options: { schema: ISchema }) => {
    const spreadSheet = await getSheet(sheetId)
    return dbManagementFactory(options.schema, spreadSheet)
  }

  return {
    createDB,
    loadDB,
    copySheet,
    getSheet,
    createSheet
  }
}

export const schemaToEmptySheets = (schema: ISchema): ISheet[] => {
  return Object.keys(schema).map((key, index) => ({
    properties: {
      title: key,
      index,
      sheetType: SheetType.GRID,
      gridProperties: {
        rowCount: 1000,
        columnCount: 26
      }
    },
    data: [
      {
        rowData: [
          {
            values: Object.keys(schema[key]).map(defKey => ({
              userEnteredValue: {
                stringValue: defKey
              },
              effectiveValue: {
                stringValue: defKey
              },
              formattedValue: defKey
            }))
          }
        ],
        rowMetadata: [],
        columnMetadata: []
      }
    ]
  }))
}
export interface IHaveSheets {
  sheets: ISheet[]
}
export const removeSheetJunk = <T extends IHaveSheets>(sheetData: T): T => ({
  // incorrect typescript error on this https://github.com/Microsoft/TypeScript/issues/10727
  ...Object.assign(sheetData),
  sheets: sheetData.sheets.map(sheet => ({
    ...sheet,
    data: sheet.data.map(data => ({
      ...data,
      rowMetadata: [],
      columnMetadata: [],
      rowData: data.rowData.map(row => ({
        ...row,
        values: row.values.map(v => ({
          userEnteredValue: v.userEnteredValue,
          effectiveValue: v.effectiveValue,
          formattedValue: v.formattedValue
        }))
      }))
    }))
  }))
})

const defaultRowMetaData = {
  pixelSize: 21
}
const defaultColumnMetaData = {
  pixelSize: 100
}
export const ensureSheetsMetadata = <T extends IHaveSheets>(
  sheetData: T
): T => ({
  // incorrect typescript error on this https://github.com/Microsoft/TypeScript/issues/10727
  ...Object.assign(sheetData),
  sheets: sheetData.sheets.map(sheet => ({
    ...sheet,
    data: sheet.data.map(data => ({
      ...data,
      rowMetadata: data.rowData.map(
        (r, index) => data.rowMetadata[index] || defaultRowMetaData
      ),
      columnMetadata: data.rowData.map(
        (r, index) => data.columnMetadata[index] || defaultColumnMetaData
      ),
      rowData: data.rowData.map(row => ({
        ...row,
        values: row.values.map(v => ({
          userEnteredValue: v.userEnteredValue,
          effectiveValue: v.effectiveValue,
          formattedValue: v.formattedValue
        }))
      }))
    }))
  }))
})

type IBaseRequest<T> = (options?: IRequestOptions) => Promise<T>
const requestFactory = ({
  accessToken,
  makeRequest,
  logger
}: {
  accessToken: string
  makeRequest: typeof fetch
  logger: {
    log: (...args: any[]) => any
    warn: (...args: any[]) => any
    error: (...args: any[]) => any
  }
}) => async ({
  baseUrl = "https://sheets.googleapis.com/v4/spreadsheets",
  url = "",
  method = "GET",
  body
}: IRequestOptions = {}) => {
  const config = {
    body: body ? JSON.stringify(body) : undefined,
    headers: new Headers({
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json"
    }),
    method
  }
  const fullUrl = [baseUrl, url.replace(/^\//, "")].filter(i => i).join("/")
  const result = await makeRequest(fullUrl, config)
  const parsed = await result.json()
  if (parsed.error) {
    logger.warn(
      "request failed: ",
      fullUrl,
      "config:",
      JSON.stringify(config, null, 2),
      "result:",
      JSON.stringify(parsed, null, 2)
    )
    const error: Error & { code?: number; status?: string } = new Error(
      parsed.error.message
    )
    error.code = parsed.error.code
    error.status = parsed.error.status
    throw error
  }
  return parsed
}

export const getSheetFactory = (request: IBaseRequest<ISheetData>) => async (
  sheetId: string
): Promise<ISheetData> => {
  const result = await request({
    url: `${sheetId}?${stringify({ includeGridData: true })}`
  })
  return result
}

export const copySheetFactory = (
  request: IBaseRequest<ISheetData>,
  getSheet = getSheetFactory(request),
  createSheet = createSheetFactory(request)
) => async (sheetId: string, title: string) => {
  const sheet = await getSheet(sheetId)
  return createSheet(title, sheet)
}

export const createSheetFactory = (request: IBaseRequest<ISheetData>) => async (
  title: string,
  sheetData?: { sheets: ISheet[] }
): Promise<ISheetData> =>
  request({
    body: {
      properties: {
        title
      },
      sheets: sheetData ? ensureSheetsMetadata(sheetData).sheets : undefined
    },
    method: "POST"
  })

const dbManagementFactory = (
  schema: ISchema,
  sheetData: { spreadsheetId: string; sheets: ISheet[] }
): IDBManger => {
  const entityLookup = Object.keys(schema).reduce(
    (db, key) => {
      db[key] = {
        _raw: () => sheetData.sheets.find(s => s.properties.title === key),
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
