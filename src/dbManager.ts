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

const dbManagementFactory = (
  schema: ISchema,
  sheetData: { spreadsheetId: string; sheets: ISheet[] }
): IDBManger => {
  const entityLookup = Object.keys(schema).reduce(
    (db, key) => {
      db[key] = {
        _raw: () => sheetData.sheets.find(s => s.properties.title === key),
        create: (entityFeilds: any) => null,
        read: (entityFeilds: any, query: any) => null,
        update: (entityFeilds: any, query: any) => null,
        delete: (query: any) => null
      } as any
      return db
    },
    {} as { [key: string]: IEntity<any> }
  )
  return {
    id: sheetData.spreadsheetId,
    getEntity: <T>(key: string) => {
      if (!entityLookup[key]) throw new Error("no entity: " + key)
      return entityLookup[key] as IEntity<T>
    }
  }
}
export default dbManagementFactory
