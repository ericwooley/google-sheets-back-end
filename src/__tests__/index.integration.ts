// @jest-environment browser
import * as fs from "fs"
import { join } from "path"
import initSheets, { IHaveSheets, removeSheetJunk } from ".."
import wineSchema from "./mocks/wineSchema"

const TOKEN: string = process.env.AUTH_TOKEN || ""
function updateMock(file: string, data: string) {
  if (process.env.UPDATE_MOCKS) {
    fs.writeFileSync(join(__dirname, "./mocks/", file), data)
  }
}
const removeAndTestChaningSpreadSheetProps = <T extends IHaveSheets>(
  sheetData: T
): T => {
  return {
    ...Object.assign(sheetData),
    sheets: sheetData.sheets.map((sheet, index) => {
      expect(sheet.properties.sheetId).toBeDefined()
      return {
        ...sheet,
        properties: {
          ...sheet.properties,
          sheetId: `<sheetId for ${index}>` as any
        }
      }
    })
  }
}
const makeSheetDataSerializable = <T extends IHaveSheets>(sheetData: T) =>
  removeSheetJunk(removeAndTestChaningSpreadSheetProps(sheetData))
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
  describe("auth error", () => {
    it("should throw an error if a request failes", async () => {
      const sheets = initSheets({
        accessToken: "<TEST>"
      })
      try {
        await sheets.createDB({
          title: "wahtever",
          schema: wineSchema
        })
      } catch (e) {
        expect(e.message).toMatchSnapshot()
      }
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

      expect(makeSheetDataSerializable(result)).toMatchSnapshot()
    })
  })
  describe("Using as a database", () => {
    const sheets = initSheets({
      accessToken: TOKEN
    })
    describe("create a new db", () => {
      it("should create a new Database", async () => {
        const db = await sheets.createDB({
          title: "test-sheet" + Date.now(),
          schema: wineSchema
        })
        expect(
          makeSheetDataSerializable({ sheets: [db.getEntity("wine")._raw()] })
        ).toMatchSnapshot()
      })
    })
  })
})
