/* eslint-disable camelcase */
import { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table'
import { useSnackbar } from 'notistack'
import { useEffect, useMemo, useState } from 'react'

import { Page } from '../../../components/common'
import { DataGrid } from '../../../components/common/DataGrid'
import { NUMBER_MODES, STRING_MODES } from '../../../components/common/DataGrid/constants'
import { dateFilterConfig, getRelations, prepareFilter } from '../../../components/common/DataGrid/utils'
import { AddButton, PageHeader } from '../../../components/ui'
import { BrowseRoutes } from '../../../core/config/routes'
import { XApiKeyApi } from '../../../core/redux/x-api-key/api'
import { ANY } from '../../../core/types'
import { Sort } from '../../../core/types/search'
import { XApiKeyModel } from '../../../core/types/x-api-key'

const ApiKeyIndexPage = () => {
  const { enqueueSnackbar } = useSnackbar()

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>({ pageIndex: 0, pageSize: 10 })

  const [deleteApiKey, apiKeyDeleteQuery] = XApiKeyApi.useDeleteMutation()
  const [deleteBulkApiKeys, apiKeysDeleteBulkQuery] = XApiKeyApi.useDeleteBulkMutation()

  const columns = useMemo<MRT_ColumnDef<XApiKeyModel>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'id',
        columnFilterModeOptions: NUMBER_MODES,
      },
      {
        accessorKey: 'apiKey',
        header: 'X-API-KEY',
        columnFilterModeOptions: STRING_MODES,
      },
      {
        accessorKey: 'comment',
        header: 'Комментарий',
        columnFilterModeOptions: STRING_MODES,
      },
      {
        ...dateFilterConfig(),
        accessorKey: 'createdAt',
        header: 'Дата',
        accessorFn: (row) => new Date(row.createdAt),
      },
    ],
    []
  )

  const xApiKeySearchQuery = XApiKeyApi.useSearchQuery({
    filter: prepareFilter(columnFilters, columns),
    page: pagination.pageIndex + 1,
    take: pagination.pageSize,
    relations: getRelations(columns),
    sort: sorting as Sort<XApiKeyModel>[],
  })

  const items = xApiKeySearchQuery.data?.items ?? []
  const rowCount = xApiKeySearchQuery.data?.total ?? 0
  const { isLoading } = xApiKeySearchQuery
  const isFetching = xApiKeySearchQuery.isFetching || apiKeyDeleteQuery.isLoading || apiKeysDeleteBulkQuery.isLoading

  const handleDelete = async (id: number) => {
    deleteApiKey(Number(id))
  }

  const handleDeleteMany = (ids: number[]) => {
    deleteBulkApiKeys(ids.map(Number))
  }

  useEffect(() => {
    if (apiKeyDeleteQuery.isSuccess) {
      enqueueSnackbar('X-API-KEYS успешно удален', { variant: 'success' })
      return
    }
    if (apiKeyDeleteQuery.isError) {
      enqueueSnackbar((apiKeyDeleteQuery.error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeyDeleteQuery.isLoading])

  useEffect(() => {
    if (apiKeysDeleteBulkQuery.isSuccess) {
      enqueueSnackbar('X-API-KEYS успешно удалены', { variant: 'success' })
      return
    }
    if (apiKeysDeleteBulkQuery.isError) {
      enqueueSnackbar((apiKeysDeleteBulkQuery.error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeysDeleteBulkQuery.isLoading])

  return (
    <Page title="Список X-API-KEY">
      <PageHeader
        title="X-API-KEYS"
        buttons={[<AddButton key="add-button" text="Добавить" to={BrowseRoutes.admin.xApiKey.create()} />]}
      />
      <DataGrid
        id="xapikey-data-grid"
        columns={columns}
        data={items}
        rowCount={rowCount}
        state={{
          isLoading,
          showProgressBars: isFetching,
          pagination,
          sorting,
          columnFilters,
        }}
        onPaginationChange={setPagination}
        onColumnFiltersChange={setColumnFilters}
        onSortingChange={setSorting}
        deleteSelected={handleDeleteMany}
        deleteOne={handleDelete}
      />
    </Page>
  )
}

export default ApiKeyIndexPage
