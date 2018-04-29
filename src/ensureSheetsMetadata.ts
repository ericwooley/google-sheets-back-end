import { IHaveSheets } from "./interfaces"
const defaultRowMetaData = {
  pixelSize: 21
}
const defaultColumnMetaData = {
  pixelSize: 100
}
const ensureSheetsMetadata = <T extends IHaveSheets>(sheetData: T): T => ({
  // incorrect typescript error on this https://github.com/Microsoft/TypeScript/issues/10727
  ...Object.assign(sheetData),
  sheets: sheetData.sheets.map(sheet => ({
    ...sheet,
    data: sheet.data.map(data => ({
      ...data,
      rowMetadata: data.rowData.map(
        (r, index) => data.rowMetadata[index] || defaultRowMetaData
      ),
      columnMetadata: data.rowData.map(
        (r, index) => data.columnMetadata[index] || defaultColumnMetaData
      ),
      rowData: data.rowData.map(row => ({
        ...row,
        values: row.values.map(v => ({
          userEnteredValue: v.userEnteredValue,
          effectiveValue: v.effectiveValue,
          formattedValue: v.formattedValue
        }))
      }))
    }))
  }))
})
export default ensureSheetsMetadata
