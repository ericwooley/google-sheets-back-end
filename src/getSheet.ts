import { stringify } from "qs"
import { IBaseRequest, ISheetData } from "./interfaces"
const getSheetFactory = (request: IBaseRequest<ISheetData>) => async (
  sheetId: string
): Promise<ISheetData> => {
  const result = await request({
    url: `${sheetId}?${stringify({ includeGridData: true })}`
  })
  return result
}
export default getSheetFactory
