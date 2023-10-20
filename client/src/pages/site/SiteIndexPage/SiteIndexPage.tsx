/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
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
import { SiteApi } from '../../../core/redux/site/api'
import { ANY } from '../../../core/types'
import { Sort } from '../../../core/types/search'
import { SiteModel } from '../../../core/types/site'

const SiteIndexPage = () => {
  const { enqueueSnackbar } = useSnackbar()

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>({ pageIndex: 0, pageSize: 10 })

  const [deleteSite, siteDeleteQuery] = SiteApi.useDeleteMutation()
  const [deleteBulkSite, siteDeleteBulkQuery] = SiteApi.useDeleteBulkMutation()

  const columns = useMemo<MRT_ColumnDef<SiteModel>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'id',
        columnFilterModeOptions: NUMBER_MODES,
      },
      {
        accessorKey: 'domain',
        header: 'Домен',
        columnFilterModeOptions: STRING_MODES,
      },
      {
        accessorFn: (row) => <>{row?.xApiKey?.apiKey || ''}</>,
        accessorKey: 'xApiKey.apiKey',
        header: 'X-API-KEY',
        Cell: ({ cell }) => <>{cell.getValue()}</>,
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

  const siteSearchQuery = SiteApi.useSearchQuery({
    filter: prepareFilter(columnFilters, columns),
    page: pagination.pageIndex + 1,
    take: pagination.pageSize,
    relations: getRelations(columns),
    sort: sorting as Sort<SiteModel>[],
  })

  const items = siteSearchQuery.data?.items ?? []
  const rowCount = siteSearchQuery.data?.total ?? 0
  const { isLoading } = siteSearchQuery
  const isFetching = siteSearchQuery.isFetching || siteDeleteQuery.isLoading || siteDeleteBulkQuery.isLoading

  const handleDelete = async (id: number) => {
    deleteSite(Number(id))
  }

  const handleDeleteMany = (ids: number[]) => {
    deleteBulkSite(ids.map(Number))
  }

  useEffect(() => {
    if (siteDeleteQuery.isSuccess) {
      enqueueSnackbar('Сайт успешно удален', { variant: 'success' })
      return
    }

    if (siteDeleteQuery.isError) {
      enqueueSnackbar((siteDeleteQuery.error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteDeleteQuery.isLoading])

  useEffect(() => {
    if (siteDeleteBulkQuery.isSuccess) {
      enqueueSnackbar('Сайты успешно удалены', { variant: 'success' })
      return
    }

    if (siteDeleteBulkQuery.isError) {
      enqueueSnackbar((siteDeleteBulkQuery.error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteDeleteBulkQuery.isLoading])

  return (
    <Page title="Список сайтов">
      <PageHeader
        title="Сайты"
        buttons={[<AddButton key="add-button" text="Добавить" to={BrowseRoutes.admin.site.create()} />]}
      />
      <DataGrid
        id="site-data-grid"
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

export default SiteIndexPage
