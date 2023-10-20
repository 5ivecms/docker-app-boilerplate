/* eslint-disable camelcase */
import { ColumnOrderState, ColumnSizingState, VisibilityState } from '@tanstack/react-table'
import { MRT_DensityState } from 'material-react-table'

export type DataGridConfig = {
  columnOrder: ColumnOrderState
  columnSizing: ColumnSizingState
  columnVisibility: VisibilityState
  density: MRT_DensityState
}
