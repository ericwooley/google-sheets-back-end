import { ISchema, ISheet, SheetType } from "./interfaces"
const schemaToEmptySheets = (schema: ISchema): ISheet[] => {
  return Object.keys(schema).map((key, index) => ({
    properties: {
      title: key,
      index,
      sheetType: SheetType.GRID,
      gridProperties: {
        rowCount: 1000,
        columnCount: 26
      }
    },
    data: [
      {
        rowData: [
          {
            values: Object.keys(schema[key]).map(defKey => ({
              userEnteredValue: {
                stringValue: defKey
              },
              effectiveValue: {
                stringValue: defKey
              },
              formattedValue: defKey
            }))
          }
        ],
        rowMetadata: [],
        columnMetadata: []
      }
    ]
  }))
}
export default schemaToEmptySheets
