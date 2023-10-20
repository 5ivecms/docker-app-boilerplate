import { ColumnSizingInfoState } from '@tanstack/react-table'

import { DataGridConfig } from './types'

export const COLUMN_SIZING_KEY = 'columnSizing'

export const COLUMN_ORDER_KEY = 'columnOrder'

export const DATA_GRID_DEFAULT_CONFIG: DataGridConfig = {
  columnOrder: [],
  columnSizing: {},
  columnVisibility: {},
  density: 'comfortable',
}

export const COMMON_MODES = ['fuzzy', 'equals', 'notEquals']

export const NUMBER_MODES = [
  'between',
  'lessThan',
  'greaterThan',
  'betweenInclusive',
  'greaterThanOrEqualTo',
  'lessThanOrEqualTo',
  ...COMMON_MODES,
]

export const BOOLEAN_MODES = ['equals']

export const STRING_MODES = ['contains', 'startsWith', 'endsWith', ...COMMON_MODES]

export const DEFAULT_COLUMN_SIZING_INFO_STATE: ColumnSizingInfoState = {
  columnSizingStart: [],
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  startOffset: null,
  startSize: null,
}
