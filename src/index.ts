import { stringify } from "qs"
export interface ISheetOptions {
  accessToken?: string
  makeRequest?: typeof fetch
}
import "isomorphic-fetch"
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
  return {
    copySheet,
    getSheet
  }
}
