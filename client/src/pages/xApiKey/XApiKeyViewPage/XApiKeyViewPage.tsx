import { Delete, Edit } from '@mui/icons-material'
import { Alert, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { DeleteDialog, InfoTable, Page } from '../../../components/common'
import { InfoTableColumn } from '../../../components/common/InfoTable/info-table.types'
import { PageHeader } from '../../../components/ui'
import { BrowseRoutes } from '../../../core/config/routes'
import { XApiKeyApi } from '../../../core/redux/x-api-key/api'
import { ANY } from '../../../core/types'
import { XApiKeyModel } from '../../../core/types/x-api-key'

const columns: InfoTableColumn<XApiKeyModel>[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'apiKey', headerName: 'ApiKey' },
]

const ApiKeyViewPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const apiKeyFindOneQuery = XApiKeyApi.useFindOneQuery(Number(id))
  const [apiKeyDelete, apiKeyDeleteQuery] = XApiKeyApi.useDeleteMutation()

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const handleDelete = (): void => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = async (): Promise<void> => {
    if (apiKeyFindOneQuery.data?.id) {
      apiKeyDelete(apiKeyFindOneQuery.data.id)
    }
    setShowDeleteDialog(false)
  }

  useEffect(() => {
    if (apiKeyDeleteQuery.isSuccess) {
      enqueueSnackbar('X-API-KEY успешно удален', {
        variant: 'success',
      })
      navigate(BrowseRoutes.admin.xApiKey.index())
      return
    }

    if (apiKeyDeleteQuery.isError) {
      enqueueSnackbar((apiKeyDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeyDeleteQuery.isLoading])

  return (
    <Page title={apiKeyFindOneQuery.data?.apiKey || ''} loading={apiKeyFindOneQuery.isLoading}>
      {apiKeyFindOneQuery.isError ? (
        <Alert severity="error">{(apiKeyFindOneQuery.error as ANY)?.data.message}</Alert>
      ) : (
        <>
          <PageHeader
            title="X-API-KEY"
            buttons={[
              <Button
                key="edit-button"
                component={Link}
                endIcon={<Edit />}
                to={BrowseRoutes.admin.xApiKey.edit(id)}
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
          <InfoTable columns={columns} data={apiKeyFindOneQuery.data} thWidth={200} />
        </>
      )}
      <DeleteDialog
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        open={showDeleteDialog}
        text="Точно удалить X-API-KEY?"
        title="Удалить X-API-KEY"
      />
    </Page>
  )
}

export default ApiKeyViewPage
