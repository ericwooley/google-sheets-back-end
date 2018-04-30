import { IBaseRequest, ISheetBatchUpdateRequest } from "./interfaces"
const sheetRequestFactory = (
  request: IBaseRequest<any>,
  spreadSheetId: string | number
) => ({
  requests,
  includeSpreadsheetInResponse = false,
  responseRanges,
  responseIncludeGridData = false
}: {
  includeSpreadsheetInResponse?: boolean
  requests: ISheetBatchUpdateRequest[]
  responseRanges?: string
  responseIncludeGridData?: boolean
}) =>
  request({
    url: `${spreadSheetId}:batchUpdate`,
    method: "POST",
    body: {
      requests,
      includeSpreadsheetInResponse,
      responseRanges,
      responseIncludeGridData
    }
  })
export default sheetRequestFactory
