import { Delete, Edit } from '@mui/icons-material'
import { Alert, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { DeleteDialog, InfoTable, Page } from '../../../components/common'
import { InfoTableColumn } from '../../../components/common/InfoTable/info-table.types'
import { PageHeader } from '../../../components/ui'
import { BrowseRoutes } from '../../../core/config/routes'
import { SiteApi } from '../../../core/redux/site/api'
import { ANY } from '../../../core/types'
import { SiteModel } from '../../../core/types/site'

const columns: InfoTableColumn<SiteModel>[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'domain', headerName: 'Домен' },
  {
    field: 'createdAt',
    headerName: 'Добавлен',
    render: (field) => <>{new Date(field).toLocaleDateString()}</>,
  },
]

const SiteViewPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const siteFindOneQuery = SiteApi.useFindOneQuery(Number(id))
  const [siteDelete, siteDeleteQuery] = SiteApi.useDeleteMutation()

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const title = siteFindOneQuery.data?.domain || ''

  const handleDelete = (): void => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = async (): Promise<void> => {
    if (siteFindOneQuery.data?.id) {
      siteDelete(siteFindOneQuery.data.id)
    }
    setShowDeleteDialog(false)
  }

  useEffect(() => {
    if (siteDeleteQuery.isSuccess) {
      enqueueSnackbar('Сайт успешно удален', { variant: 'success' })
      navigate(BrowseRoutes.admin.site.index())
      return
    }

    if (siteDeleteQuery.isError) {
      enqueueSnackbar((siteDeleteQuery.error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteDeleteQuery.isLoading])

  return (
    <Page title={title} loading={siteFindOneQuery.isLoading}>
      {siteFindOneQuery.isError ? (
        <Alert severity="error">{(siteFindOneQuery.error as ANY)?.data.message}</Alert>
      ) : (
        <>
          <PageHeader
            title={title}
            buttons={[
              <Button
                key="edit-button"
                component={Link}
                endIcon={<Edit />}
                to={BrowseRoutes.admin.site.edit(id)}
                variant="contained"
              >
                Редактировать
              </Button>,
              <Button key="delete-button" color="error" endIcon={<Delete />} onClick={handleDelete} variant="contained">
                Удалить
              </Button>,
            ]}
            showBackButton
          />
          <InfoTable columns={columns} data={siteFindOneQuery.data} thWidth={200} />
        </>
      )}
      <DeleteDialog
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        open={showDeleteDialog}
        text="Точно удалить сайт?"
        title="Удалить сайт"
      />
    </Page>
  )
}

export default SiteViewPage
