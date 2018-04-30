import { LOG_LEVELS } from "./logger"
export interface ISheetData {
  spreadsheetId: string
  properties: ISpreadSheetProperties
  sheets: ISheet[]
  namedRanges: INamedRange[]
  spreadsheetUrl: string
  developerMetadata: IDeveloperMetadata[]
}
export interface IRequestOptions {
  baseUrl?: string
  url?: string
  method?: "GET" | "PUT" | "POST" | "PATCH"
  body?: Object // tslint:disable-line
}
export interface IHaveSheets {
  sheets: ISheet[]
}
export interface ISheetOptions {
  accessToken: string
  makeRequest?: typeof fetch
  logLevel?: LOG_LEVELS
}

export type EntityTypes = "string" | "number" | "date"

export interface ISchemaEntity {
  [key: string]: ISchemaAttribute
}
export interface ISchemaAttribute {
  type: EntityTypes
  validate?: (value: any) => string
}
export interface ISchema {
  [key: string]: ISchemaEntity
}
export interface ICreateDBOptions {
  schema: ISchema
  title: string
}
export interface IDBManger {
  id: string
  getEntity: <T>(entityName: string) => IEntity<T>
}
export interface IEntity<T> {
  _raw: () => ISheet
  create: (entityFeilds: any) => Promise<T>
  read: (query: any) => Promise<T>
  update: (entityFeilds: any, query: any) => Promise<T>
  delete: (query: any) => Promise<string[]>
}
export type IBaseRequest<T> = (options?: IRequestOptions) => Promise<T>
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

export interface ISheetBatchUpdateRequest {
  addBanding?: {} // TODO: create interface for AddBandingRequest
  addChart?: {} // TODO: create interface for AddChartRequest
  addConditionalFormatRule?: {} // TODO: create interface for AddConditionalFormatRuleRequest
  addFilterView?: {} // TODO: create interface for AddFilterViewRequest
  addNamedRange?: {} // TODO: create interface for AddNamedRangeRequest
  addProtectedRange?: {} // TODO: create interface for AddProtectedRangeRequest
  addSheet?: {} // TODO: create interface for AddSheetRequest
  appendCells?: {
    sheetId: number
    rows: IRowData[]
    fields: string
  } // TODO: create interface for AppendCellsRequest
  appendDimension?: {} // TODO: create interface for AppendDimensionRequest
  autoFill?: {} // TODO: create interface for AutoFillRequest
  autoResizeDimensions?: {} // TODO: create interface for AutoResizeDimensionsRequest
  clearBasicFilter?: {} // TODO: create interface for ClearBasicFilterRequest
  copyPaste?: {} // TODO: create interface for CopyPasteRequest
  createDeveloperMetadata?: {} // TODO: create interface for CreateDeveloperMetadataRequest
  cutPaste?: {} // TODO: create interface for CutPasteRequest
  deleteBanding?: {} // TODO: create interface for DeleteBandingRequest
  deleteConditionalFormatRule?: {} // TODO: create interface for DeleteConditionalFormatRuleRequest
  deleteDeveloperMetadata?: {} // TODO: create interface for DeleteDeveloperMetadataRequest
  deleteDimension?: {} // TODO: create interface for DeleteDimensionRequest
  deleteEmbeddedObject?: {} // TODO: create interface for DeleteEmbeddedObjectRequest
  deleteFilterView?: {} // TODO: create interface for DeleteFilterViewRequest
  deleteNamedRange?: {} // TODO: create interface for DeleteNamedRangeRequest
  deleteProtectedRange?: {} // TODO: create interface for DeleteProtectedRangeRequest
  deleteRange?: {} // TODO: create interface for DeleteRangeRequest
  deleteSheet?: {} // TODO: create interface for DeleteSheetRequest
  duplicateFilterView?: {} // TODO: create interface for DuplicateFilterViewRequest
  duplicateSheet?: {} // TODO: create interface for DuplicateSheetRequest
  findReplace?: {} // TODO: create interface for FindReplaceRequest
  insertDimension?: {} // TODO: create interface for InsertDimensionRequest
  insertRange?: {} // TODO: create interface for InsertRangeRequest
  mergeCells?: {} // TODO: create interface for MergeCellsRequest
  moveDimension?: {} // TODO: create interface for MoveDimensionRequest
  pasteData?: {} // TODO: create interface for PasteDataRequest
  randomizeRange?: {} // TODO: create interface for RandomizeRangeRequest
  repeatCell?: {} // TODO: create interface for RepeatCellRequest
  setBasicFilter?: {} // TODO: create interface for SetBasicFilterRequest
  setDataValidation?: {} // TODO: create interface for SetDataValidationRequest
  sortRange?: {} // TODO: create interface for SortRangeRequest
  textToColumns?: {} // TODO: create interface for TextToColumnsRequest
  unmergeCells?: {} // TODO: create interface for UnmergeCellsRequest
  updateBanding?: {} // TODO: create interface for UpdateBandingRequest
  updateBorders?: {} // TODO: create interface for UpdateBordersRequest
  updateCells?: {} // TODO: create interface for UpdateCellsRequest
  updateChartSpec?: {} // TODO: create interface for UpdateChartSpecRequest
  updateConditionalFormatRule?: {} // TODO: create interface for UpdateConditionalFormatRuleRequest
  updateDeveloperMetadata?: {} // TODO: create interface for UpdateDeveloperMetadataRequest
  updateDimensionProperties?: {} // TODO: create interface for UpdateDimensionPropertiesRequest
  updateEmbeddedObjectPosition?: {} // TODO: create interface for UpdateEmbeddedObjectPositionRequest
  updateFilterView?: {} // TODO: create interface for UpdateFilterViewRequest
  updateNamedRange?: {} // TODO: create interface for UpdateNamedRangeRequest
  updateProtectedRange?: {} // TODO: create interface for UpdateProtectedRangeRequest
  updateSheetProperties?: {} // TODO: create interface for UpdateSheetPropertiesRequest
  updateSpreadsheetProperties?: {} // TODO: create interface for UpdateSpreadsheetPropertiesRequest
}
