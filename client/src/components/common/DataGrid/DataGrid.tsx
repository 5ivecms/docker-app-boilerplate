/* eslint-disable react/jsx-pascal-case */
/* eslint-disable camelcase */
import { Delete, Edit, Visibility } from '@mui/icons-material'
import { Box, IconButton, MenuItem, Tooltip } from '@mui/material'
import {
  ColumnOrderState,
  ColumnSizingInfoState,
  ColumnSizingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table'
import MaterialReactTable, {
  MaterialReactTableProps,
  MRT_DensityState,
  MRT_FullScreenToggleButton,
  MRT_ShowHideColumnsButton,
  MRT_TableInstance,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
} from 'material-react-table'
import { MRT_Localization_RU } from 'material-react-table/locales/ru'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { DeleteDialog } from './components'
import { DeleteDialogProps } from './components/DeleteDialog/DeleteDialog'
import { DEFAULT_COLUMN_SIZING_INFO_STATE } from './constants'
import { useDebounce } from './hooks'
import {
  getColumnOrder,
  getColumnSizing,
  getColumnVisibility,
  getDensity,
  getEditUrl,
  getViewUrl,
  saveColumnOrder,
  saveColumnSizing,
  saveColumnVisibility,
  saveDensity,
} from './utils'

type DeleteSelected = {
  id: string
  deleteSelected?: (ids: number[]) => void
  deleteOne?: (id: number) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataGrid = <TData extends Record<string, any> = object>({
  deleteSelected,
  deleteOne,
  ...rest
}: MaterialReactTableProps<TData> & DeleteSelected) => {
  const columnOrderData = getColumnOrder(rest.id)
  const [density, setDensity] = useState<MRT_DensityState>(getDensity(rest.id))
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(getColumnVisibility(rest.id))
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columnOrderData.length
      ? columnOrderData
      : ['mrt-row-actions', 'mrt-row-select', ...(rest.columns.map((c) => c.accessorKey) as string[])]
  )

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(getColumnSizing(rest.id))
  const [columnSizingInfo, setColumnSizingInfo] = useState<ColumnSizingInfoState>(DEFAULT_COLUMN_SIZING_INFO_STATE)
  const debouncing = useDebounce(columnSizingInfo, 200)

  const tableInstanceRef = useRef<MRT_TableInstance<TData> | null>(null)
  const columnSizingInfoRef = useRef<ColumnSizingInfoState>(DEFAULT_COLUMN_SIZING_INFO_STATE)
  const deleteDialogState = useRef<Omit<DeleteDialogProps, 'open' | 'onClose'>>({
    title: 'Удалить',
    text: 'Подтвердите действие',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onConfirm: () => {},
  })

  const openDeleteSelectedDialog = () => {
    if (!tableInstanceRef.current) {
      return
    }

    const ids = tableInstanceRef.current.getSelectedRowModel().rows.map((row) => Number(row.original.id))
    deleteDialogState.current = {
      onConfirm: () => {
        if (deleteSelected !== undefined) {
          deleteSelected(ids)
        }
        tableInstanceRef.current?.resetRowSelection()
        setShowDeleteDialog(false)
      },
      title: 'Удалить выбранные?',
      text: 'Точно удалить выбранные?',
    }
    setShowDeleteDialog(true)
  }

  const openDeleteDialog = (id: number) => {
    deleteDialogState.current = {
      onConfirm: () => {
        if (deleteOne !== undefined) {
          deleteOne(id)
        }
        setShowDeleteDialog(false)
      },
      title: 'Удалить',
      text: 'Точно удалить?',
    }
    setShowDeleteDialog(true)
  }

  const onColumnVisibilityChange = (updater: Updater<VisibilityState>) => {
    setColumnVisibility(updater)
    if (typeof updater === 'function') {
      const data = updater(columnVisibility)
      saveColumnVisibility(rest.id, data)
    }
  }

  const onColumnOrderChange = (updater: Updater<ColumnOrderState>) => {
    setColumnOrder(updater)
    if (typeof updater !== 'function') {
      saveColumnOrder(rest.id, updater)
    }
  }

  const onColumnSizingInfoChange = (updater: Updater<ColumnSizingInfoState>) => {
    if (typeof updater === 'function') {
      const data = updater(columnSizingInfoRef.current)
      columnSizingInfoRef.current = data
      if (data.isResizingColumn !== false) {
        setColumnSizingInfo(data)
      }
    }
  }

  const onDensityChange = (updater: Updater<MRT_DensityState>) => {
    if (typeof updater !== 'function') {
      setDensity(updater)
      saveDensity(rest.id, updater)
    }
  }

  const changeColumnSizing = useCallback(
    (data: ColumnSizingState) => {
      setColumnSizing((prev) => ({ ...prev, ...data }))
      saveColumnSizing(rest.id, data)
    },
    [rest.id]
  )

  useEffect(() => {
    const { deltaOffset, startSize, isResizingColumn } = debouncing
    if (deltaOffset && startSize && isResizingColumn !== false) {
      changeColumnSizing({ [isResizingColumn]: deltaOffset + startSize })
    }
  }, [changeColumnSizing, debouncing])

  return (
    <>
      <MaterialReactTable
        tableInstanceRef={tableInstanceRef}
        {...rest}
        initialState={{ columnSizing }}
        state={{ ...rest.state, columnOrder, columnVisibility, density }}
        layoutMode="grid"
        enableRowActions
        manualFiltering
        manualPagination
        manualSorting
        enableColumnFilterModes
        renderRowActionMenuItems={({ closeMenu, row }) => [
          <MenuItem key="view" component={Link} to={getViewUrl(row.original.id)}>
            <Visibility color="success" sx={{ mr: 1 }} />
            Просмотр
          </MenuItem>,
          <MenuItem key="edit" component={Link} to={getEditUrl(row.original.id)}>
            <Edit color="primary" sx={{ mr: 1 }} />
            Редактировать
          </MenuItem>,
          <MenuItem
            key="delete"
            onClick={() => {
              openDeleteDialog(row.original.id)
              closeMenu()
            }}
          >
            <Delete color="error" sx={{ mr: 1 }} />
            Удалить
          </MenuItem>,
        ]}
        renderToolbarInternalActions={({ table }) => {
          const deleteSelectedDisabled = !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          return (
            <Box>
              <MRT_ToggleFiltersButton table={table} />
              <MRT_ShowHideColumnsButton table={table} />
              <MRT_ToggleDensePaddingButton table={table} />
              <MRT_FullScreenToggleButton table={table} />
              {deleteSelected !== undefined && (
                <Tooltip title="Удалить выбранные">
                  <span>
                    <IconButton onClick={openDeleteSelectedDialog} disabled={deleteSelectedDisabled}>
                      <Delete color={deleteSelectedDisabled ? 'disabled' : 'error'} />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </Box>
          )
        }}
        displayColumnDefOptions={{
          'mrt-row-select': {
            size: 40,
            maxSize: 40,
            minSize: 40,
            muiTableHeadCellProps(props) {
              return {
                ...props,
                sx: { px: 0, textAlign: 'center', maxWidth: 'calc(var(--header-mrt_row_select-size) * 1px)' },
              }
            },
            muiTableBodyCellProps(props) {
              return {
                ...props,
                sx: { p: 0, justifyContent: 'center', maxWidth: 'calc(var(--header-mrt_row_select-size) * 1px)' },
              }
            },
          },
          'mrt-row-actions': {
            header: '',
            size: 56,
            maxSize: 56,
            minSize: 56,
            muiTableHeadCellProps(props) {
              return {
                ...props,
                sx: { maxWidth: 'calc(var(--header-mrt_row_actions-size) * 1px)' },
              }
            },
            muiTableBodyCellProps(props) {
              return {
                ...props,
                sx: {
                  textAlign: 'center',
                  maxWidth: 'calc(var(--col-mrt_row_actions-size) * 1px)',
                  ' .MuiButtonBase-root': { ml: 0 },
                },
              }
            },
          },
        }}
        enableRowSelection
        muiTableHeadCellFilterTextFieldProps={({ column }) => {
          return {
            sx: {
              width: '100%',
              ' .MuiSvgIcon-root': { width: '0.75em', height: '0.75em' },
              ' .MuiInputBase-root': { px: '0.5rem' },
              ' .MuiInputAdornment-root': { mr: '2px' },
              ' .MuiButtonBase-root': { width: '1.5rem', height: '1.5rem' },
            },
            variant: 'outlined',
            size: 'small',
            helperText: '',
            placeholder: column.columnDef.header,
          }
        }}
        muiTableHeadCellProps={{
          sx: {
            px: '0.5rem',
            ' .Mui-TableHeadCell-ResizeHandle-Wrapper': { right: '8px' },
            ' .Mui-TableHeadCell-Content-Actions .MuiButtonBase-root': {
              margin: '0 -4px',
            },
          },
        }}
        muiTableHeadCellFilterCheckboxProps={{
          title: '',
        }}
        enableColumnResizing
        enableColumnOrdering
        columnResizeMode="onChange"
        onColumnOrderChange={onColumnOrderChange}
        onColumnSizingInfoChange={onColumnSizingInfoChange}
        onColumnVisibilityChange={onColumnVisibilityChange}
        onDensityChange={onDensityChange}
        localization={MRT_Localization_RU}
      />
      <DeleteDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={deleteDialogState.current.onConfirm}
        text={deleteDialogState.current.text}
        title={deleteDialogState.current.title}
      />
    </>
  )
}

export default DataGrid
