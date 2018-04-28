import initSheets, { IDBManger } from ".."
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
        accessToken: TOKEN
      })
      expect(sheets).toMatchSnapshot("returned-api")
    })
  })
  describe("Database Like Operations", () => {
    let sheets = initSheets({
      accessToken: TOKEN
    })
    beforeEach(() => {
      sheets = initSheets({
        accessToken: TOKEN
      })
    })
    describe("Create DB", () => {
      it("Should Use a schema", async () => {
        const db = await sheets.createDB({
          schema: wineSchema
        })
      })
    })
    describe("Load a DB", () => {
      it("should load a db by id", async () => {
        const db = await sheets.loadDB("test-database-id", {
          schema: wineSchema
        })
      })
    })
    describe("CRUD", () => {
      let db: IDBManger = {} as any
      beforeEach(async () => {
        db = await sheets.loadDB("test-database-id", {
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
