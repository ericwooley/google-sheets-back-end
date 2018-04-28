import "whatwg-fetch"
import initSheets from ".."
import mocks from "./mocks"
const TOKEN = "Test Token"

const mockFetch = (...responses: any[]) => {
  const mock = jest.fn()
  responses.forEach(r =>
    mock.mockReturnValueOnce(
      Promise.resolve({ json: () => Promise.resolve(r) })
    )
  )
  return mock
}
describe("Google Sheets As a db", () => {
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
      accessToken: TOKEN,
      makeRequest: mockFetch(mocks.templateSheet)
    })
    beforeEach(() => {
      sheets = initSheets({
        accessToken: TOKEN,
        makeRequest: mockFetch(mocks.templateSheet)
      })
    })
    it("should get a sheet", async () => {
      const result = await sheets.getSheet(
        "1sQpusd4BmF3kbTaTcdkOSYihSD0ltVnOUn_bKY14i7Y"
      )
      expect(result).toMatchSnapshot()
    })
  })
})
