/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { ColumnOrderState, ColumnSizingState, VisibilityState } from '@tanstack/react-table'
import { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_DensityState } from 'material-react-table'
import moment from 'moment'

import { DateRange, InputDateRangePicker } from '../../forms/InputDateRangePicker'
import { DATA_GRID_DEFAULT_CONFIG } from './constants'
import { DataGridConfig } from './types'

export const prepareFilter = <T extends object = object>(
  filterState: MRT_ColumnFiltersState,
  columns: MRT_ColumnDef<T>[]
) => {
  try {
    return filterState.reduce((acc, item) => {
      const column = columns.find((column) => column.accessorKey === item.id)
      if (!column) {
        return acc
      }
      // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
      const mode = (column as any)._filterFn
      return { ...acc, [item.id]: { value: Array.isArray(item.value) ? Array.from(item.value) : item.value, mode } }
    }, {})
  } catch (e) {
    return {}
  }
}

export const getRelations = <T extends object = object>(columns: MRT_ColumnDef<T>[]) => {
  return columns.reduce((acc: string[], column) => {
    if (!column.accessorKey || typeof column.accessorKey !== 'string') {
      return acc
    }

    const parts = column.accessorKey.split('.')
    if (parts.length < 2) {
      return acc
    }

    const needed = parts.slice(0, -1)

    return [...acc, needed.join('.')]
  }, [])
}

export const dateFilterConfig = <T extends object = object>(): MRT_ColumnDef<T> => {
  return {
    header: '',
    filterFn: 'fuzzy',
    Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(),
    Filter: ({ column }) => {
      let datePeriod: undefined | DateRange
      const value = column.getFilterValue() as Date[] | undefined
      if (value !== undefined) {
        datePeriod = {
          startDate: value[0] as Date,
          endDate: value[1] as Date,
        }
      }

      return (
        <InputDateRangePicker
          value={datePeriod}
          onApply={(date: DateRange) => {
            column.setFilterValue(() => [
              moment(date.startDate).format('YYYY-MM-DD') as unknown as Date,
              moment(date.endDate).format('YYYY-MM-DD') as unknown as Date,
            ])
          }}
          onClear={() => column.setFilterValue(() => ['', ''])}
          inputProps={{
            sx: {
              width: '100%',
              px: '0.5rem',
              ' .MuiSvgIcon-root': { width: '0.75em', height: '0.75em' },
              ' .MuiInputBase-root': { px: '0.5rem' },
              ' .MuiInputAdornment-root': { mr: '2px' },
              ' .MuiButtonBase-root': { width: '1.5rem', height: '1.5rem' },
            },
          }}
        />
      )
    },
  }
}

export const getViewUrl = (id: number) => `view/${id}`
export const getEditUrl = (id: number) => `edit/${id}`

const getDataGridConfig = (gridId: string): DataGridConfig => {
  try {
    const config = localStorage.getItem(gridId)
    return config ? JSON.parse(config) : DATA_GRID_DEFAULT_CONFIG
  } catch (e) {
    return DATA_GRID_DEFAULT_CONFIG
  }
}

const setDataGridConfig = (gridId: string, config: DataGridConfig): void => {
  localStorage.setItem(gridId, JSON.stringify(config))
}

export const saveColumnOrder = (gridId: string, columnOrder: ColumnOrderState): void => {
  let config = getDataGridConfig(gridId)
  config = { ...config, columnOrder }
  setDataGridConfig(gridId, config)
}

export const getColumnOrder = (gridId: string): string[] => {
  const config = getDataGridConfig(gridId)
  return config.columnOrder
}

export const saveColumnSizing = (gridId: string, data: ColumnSizingState) => {
  const config = getDataGridConfig(gridId)
  config.columnSizing = { ...config.columnSizing, ...data }
  setDataGridConfig(gridId, config)
}

export const getColumnSizing = (gridId: string): ColumnSizingState => {
  const config = getDataGridConfig(gridId)
  return config.columnSizing
}

export const saveColumnVisibility = (gridId: string, data: VisibilityState) => {
  const config = getDataGridConfig(gridId)
  config.columnVisibility = data
  setDataGridConfig(gridId, config)
}

export const getColumnVisibility = (gridId: string) => {
  const config = getDataGridConfig(gridId)
  return config.columnVisibility
}

export const saveDensity = (gridId: string, data: MRT_DensityState) => {
  const config = getDataGridConfig(gridId)
  config.density = data
  setDataGridConfig(gridId, config)
}

export const getDensity = (gridId: string) => {
  const config = getDataGridConfig(gridId)
  return config.density
}
