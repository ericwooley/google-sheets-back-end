import ensureSheetsMetadata from "./ensureSheetsMetadata"
import {
  IBaseRequest,
  ICreateDBOptions,
  IDBManger,
  IEntity,
  IRequestOptions,
  ISchema,
  ISheet,
  ISheetData,
  ISheetOptions,
  SheetType
} from "./interfaces"
const createSheetFactory = (request: IBaseRequest<ISheetData>) => async (
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
export default createSheetFactory
