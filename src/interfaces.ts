export interface ISheetData {
  spreadsheetId: string
  properties: ISpreadSheetProperties
  sheets: ISheet[]
  namedRanges: INamedRange[]
  spreadsheetUrl: string
  developerMetadata: IDeveloperMetadata[]
}

export interface ISpreadSheetProperties {
  title: string
  locale: string
  autoRecalc: number
  timeZone: string
  defaultFormat: any
  iterativeCalculationSettings: any
}

export interface IDeveloperMetadata {
  metadataId: number
  metadataKey: string
  metadataValue: string
  location: any
  visibility: string | number
}

export interface INamedRange {
  namedRangeId: string
  name: string
  range: IGridRange
}

export interface IExtendedValue {
  // Union field value can be only one of the following:
  numberValue?: number
  stringValue?: string
  boolValue?: boolean
  formulaValue?: string
  errorValue?: IErrorValue
  // End of list of possible types for union field value.
}

export interface IErrorValue {
  type: ErrorType
  message: string
}

export enum ErrorType {
  ERROR_TYPE_UNSPECIFIED, // The default error type, do not use this.
  ERROR, // Corresponds to the #ERROR! error.
  NULL_VALUE, // Corresponds to the #NULL! error.
  DIVIDE_BY_ZERO, // Corresponds to the #DIV/0 error.
  VALUE, // Corresponds to the #VALUE! error.
  REF, // Corresponds to the #REF! error.
  NAME, // Corresponds to the #NAME? error.
  NUM, // Corresponds to the #NUM! error.
  N_A, // Corresponds to the #N/A error.
  LOADING // Corresponds to the Loading... state.
}

export interface ICellData {
  userEnteredValue?: IExtendedValue
  effectiveValue?: IExtendedValue
  formattedValue?: string
  userEnteredFormat?: ICellFormat
  effectiveFormat?: ICellFormat
  hyperlink?: string
  note?: string
  textFormatRuns?: ITextFormatRun[]
  dataValidation?: IDataValidationRule
  pivotTable?: IPivotTable
}

export interface IRowData {
  values: ICellData[]
}

export interface IDimensionProperties {
  hiddenByFilter: boolean
  hiddenByUser: boolean
  pixelSize: number
  developerMetadata: IDeveloperMetadata[]
}

export interface IGridData {
  startRow?: number
  startColumn?: number
  rowData: IRowData[]
  rowMetadata: IDimensionProperties[]
  columnMetadata: IDimensionProperties[]
}

export interface IGridRange {
  sheetId: number
  startRowIndex: number
  endRowIndex: number
  startColumnIndex: number
  endColumnIndex: number
}
export interface ISheetProperties {
  sheetId?: number
  title: string
  index: number
  sheetType: SheetType
  gridProperties: IGridProperties
  hidden?: boolean
  tabColor?: IColor
  rightToLeft?: boolean
}

export interface IColor {
  red?: number
  green?: number
  blue?: number
  alpha?: number
}

export enum SheetType {
  SHEET_TYPE_UNSPECIFIED = "SHEET_TYPE_UNSPECIFIED", // Default value, do not use.
  GRID = "GRID", // The sheet is a grid.
  OBJECT = "OBJECT" // The sheet has no grid and instead has an object like a chart or image.
}

export interface IGridProperties {
  rowCount: number
  columnCount: number
  frozenRowCount?: number
  frozenColumnCount?: number
  hideGridlines?: boolean
}

export interface ISheet {
  properties: ISheetProperties
  data: IGridData[]
  merges?: IGridRange[]
  conditionalFormats?: IConditionalFormatRule[]
  filterViews?: IFilterView[]
  protectedRanges?: any[]
  basicFilter?: any
  charts?: any[]
  bandedRanges?: any[]
  developerMetadata?: IDeveloperMetadata[]
}

export interface ICellFormat {
  numberFormat?: INumberFormat
  backgroundColor?: IColor
  borders?: IBorders
  padding?: IPadding
  horizontalAlignment?: string
  verticalAlignment?: string
  wrapStrategy?: string
  textDirection?: string
  textFormat?: ITextFormat
  hyperlinkDisplayType?: any
  textRotation?: ITextRotation
}

export interface ITextRotation {
  angle: number
  vertical: boolean
}

export interface IPadding {
  top: number
  right: number
  bottom: number
  left: number
}

export interface IBorders {
  top: IBorder
  bottom: IBorder
  left: IBorder
  right: IBorder
}

export interface IBorder {
  style: any
  width: number
  color: IColor
}

export interface INumberFormat {
  type: string | number
  pattern: string
}

export interface ITextFormat {
  foregroundColor?: IColor
  fontFamily?: string
  fontSize?: number
  bold?: boolean
  italic?: boolean
  strikethrough?: boolean
  underline?: boolean
}

export interface ITextFormatRun {
  startIndex: number
  format: ITextFormat
}

export interface ITextRotation {
  // Union field type can be only one of the following:
  angle: number
  vertical: boolean
  // End of list of possible types for union field type.
}

export interface IDataValidationRule {
  condition: IBooleanCondition
  inputMessage: string
  strict: boolean
  showCustomUi: boolean
}

export interface IBooleanCondition {
  type: string | number
  values: IConditionValue
}

export interface IConditionValue {
  relativeDate: string | number
  userEnteredValue: string
}

export interface IPivotTable {
  source: IGridRange
  rows: any[]
  columns: any[]
  criteria: any
  values: any[]
  valueLayout: string | number
}

export interface IConditionalFormatRule {
  ranges: IGridRange[]

  // Union field rule can be only one of the following:
  booleanRule: any
  gradientRule: any
}

export interface IFilterView {
  filterViewId: number
  title: string
  range: IGridRange
  namedRangeId: string
  sortSpecs: any
  criteria: any
}
