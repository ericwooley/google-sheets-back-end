import copySheetFactory from "./copySheet"
import createSheetFactory from "./createSheet"
import dbManagementFactory from "./dbManager"
import getSheetFactory from "./getSheet"
import {
  ICreateDBOptions,
  IDBManger,
  IHaveSheets,
  ISchema,
  ISheet,
  ISheetData,
  ISheetOptions
} from "./interfaces"
import logFactory, { LOG_LEVELS } from "./logger"
import requestFactory from "./request"
import schemaToEmptySheets from "./schemaToEmptySheets"

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

  const createDB = async (options: ICreateDBOptions): Promise<IDBManger> => {
    const sheets = schemaToEmptySheets(options.schema)
    const newSheet = await createSheet(options.title, { sheets })
    return loadDB(newSheet.spreadsheetId, options)
  }
  const loadDB = async (
    sheetId: string,
    options: { schema: ISchema }
  ): Promise<IDBManger> => {
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
