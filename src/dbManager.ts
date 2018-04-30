import entityFactory from "./entity"
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
import sheetRequestFactory from "./sheetRequest"
const dbManagementFactory = (
  schema: ISchema,
  sheetData: { spreadsheetId: string; sheets: ISheet[] },
  request: IBaseRequest<any>
): IDBManger => {
  const sheetRequest = sheetRequestFactory(request, sheetData.spreadsheetId)
  const entityLookup = Object.keys(schema).reduce(
    (db, key) => {
      db[key] = <T>() => {
        const sheet = sheetData.sheets.find(s => s.properties.title === key)
        if (!sheet) throw new Error("Cannot find sheet for: " + key)
        const schemaEntity = schema[key]
        return entityFactory<T>(sheet, schemaEntity, sheetRequest)
      }

      return db
    },
    {} as { [key: string]: <T>() => IEntity<T> }
  )
  return {
    id: sheetData.spreadsheetId,
    getEntity: <T>(key: string) => {
      if (!entityLookup[key]) throw new Error("no entity: " + key)
      return entityLookup[key]<T>()
    }
  }
}
export default dbManagementFactory
