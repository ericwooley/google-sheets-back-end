import {
  IEntity,
  ISchemaEntity,
  ISheet,
  ISheetBatchUpdateRequest
} from "./interfaces"
export default function entityFactory<T>(
  sheet: ISheet,
  schema: ISchemaEntity,
  sheetRequest: (requests: ISheetBatchUpdateRequest[]) => Promise<any>
): IEntity<T> {
  return {
    _raw: () => sheet,
    create: async (entity: T) => {
      // TODO: Validate Rows with schemaEntity Validation
      // TODO: Use sheet request to create rows
      return Promise.resolve({} as any)
    },
    read: (query: any) => Promise.resolve({} as any),
    update: (entityFeilds: any, query: any) => Promise.resolve({} as any),
    delete: (query: any) => Promise.resolve([])
  }
}
