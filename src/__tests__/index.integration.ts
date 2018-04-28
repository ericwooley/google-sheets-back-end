// @jest-environment browser
import * as fs from "fs"
import { join } from "path"
import initSheets from ".."
const TOKEN: string = process.env.AUTH_TOKEN || ""
function updateMock(file: string, data: string) {
  if (process.env.UPDATE_MOCKS) {
    fs.writeFileSync(join(__dirname, "./mocks/", file), data)
  }
}
describe("Google Sheets As a db", () => {
  beforeAll(() => {
    if (!TOKEN) {
      throw new Error(
        "Integration tests require an oauth token from the google oauth2 playground"
      )
    }
    if (TOKEN.length < 100) {
      console.warn(`Your token appears to be too short ${TOKEN.length}`)
    }
  })
  describe("initializing as a database", () => {
    it("should initialize", () => {
      const sheets = initSheets({
        accessToken: TOKEN
      })
      expect(sheets).toMatchSnapshot("returned-api")
    })
  })
  describe("Getting a sheet", () => {
    let sheets = initSheets({
      accessToken: TOKEN
    })
    beforeEach(() => {
      sheets = initSheets({
        accessToken: TOKEN
      })
    })
    it("should get a sheet", async () => {
      const result = await sheets.getSheet(
        "1sQpusd4BmF3kbTaTcdkOSYihSD0ltVnOUn_bKY14i7Y"
      )
      updateMock("template_sheet.json", JSON.stringify(result, null, 2))

      expect(result).toMatchSnapshot()
    })
  })
})
