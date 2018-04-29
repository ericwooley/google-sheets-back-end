import createSheetFactory from "./createSheet"
import getSheetFactory from "./getSheet"
import { IBaseRequest, ISheet, ISheetData } from "./interfaces"

const copySheetFactory = (
  request: IBaseRequest<ISheetData>,
  getSheet = getSheetFactory(request),
  createSheet = createSheetFactory(request)
) => async (sheetId: string, title: string) => {
  const sheet = await getSheet(sheetId)
  return createSheet(title, sheet)
}
export default copySheetFactory
