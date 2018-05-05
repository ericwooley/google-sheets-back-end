import initSheets from ".."
import { IDBManger } from "../interfaces"
import mocks from "./mocks"
import wineSchema from "./mocks/wineSchema"
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
        accessToken: TOKEN,
        makeRequest: mockFetch({}, {}, {})
      })
      expect(sheets).toMatchSnapshot("returned-api")
    })
  })
  describe("Database Like Operations", () => {
    let sheets = initSheets({
      accessToken: TOKEN,
      makeRequest: mockFetch({}, {}, {})
    })
    beforeEach(() => {
      sheets = initSheets({
        accessToken: TOKEN,
        makeRequest: mockFetch({}, {}, {})
      })
    })
    describe("Create DB", () => {
      it("Should Use a schema", async () => {
        const db = await sheets.createDB({
          title: "test",
          schema: wineSchema
        })
      })
    })
    describe("Load a DB", () => {
      const makeRequest = mockFetch(mocks.templateSheet)
      sheets = initSheets({
        accessToken: TOKEN,
        makeRequest
      })
      it("should load a db by id", async () => {
        const db = await sheets.loadDB("test-database-id", {
          schema: wineSchema
        })
      })
      console.log("mk", makeRequest.mock)
      expect(makeRequest.mock.calls.length).toBe(1)
    })
    describe("CRUD", () => {
      let makeRequest = mockFetch({}, {}, {})
      let sh = initSheets({
        accessToken: TOKEN,
        makeRequest
      })
      let db: IDBManger = {} as any
      beforeEach(async () => {
        makeRequest = mockFetch({}, {}, {})
        sh = initSheets({
          accessToken: TOKEN,
          makeRequest
        })

        db = await sh.loadDB("test-database-id", {
          schema: wineSchema
        })
      })
      describe("create", () => {
        it("should performa a basic create", async () => {
          const wineEntity = db.getEntity<any>("wine")
          wineEntity.create({
            id: "asdfasdf"
          })
        })
      })
      describe("read", () => {
        it("should performa a basic read", async () => {
          const wineEntity = db.getEntity<any>("wine")
          wineEntity.read({
            id: "asdfasdf"
          })
        })
      })
      describe("update", () => {
        it("should performa a basic update", async () => {
          const wineEntity = db.getEntity<any>("wine")
          wineEntity.update(
            {
              name: "asdfasdf"
              // ...
            },
            {
              id: "asdfasdfasdf"
            }
          )
        })
      })
      describe("delete", () => {
        it("should performa a basic delete", async () => {
          const wineEntity = db.getEntity<any>("wine")
          wineEntity.delete({
            id: "asdfasdf"
            // ...
          })
        })
      })
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
