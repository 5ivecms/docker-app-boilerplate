import { Alert, Grid, Paper } from '@mui/material'
import { useParams } from 'react-router-dom'

import { Page } from '../../../components/common'
import { PageHeader } from '../../../components/ui'
import { XApiKeyApi } from '../../../core/redux/x-api-key/api'
import { ANY } from '../../../core/types'
import { EditApiKeyForm } from './components'

const ApiKeyEditPage = () => {
  const params = useParams()
  const { id } = params
  const { data, isLoading, isError, error } = XApiKeyApi.useFindOneQuery(Number(id))

  return (
    <Page title={data?.apiKey || ''} loading={isLoading}>
      {isError && error && <Alert severity="error">{(error as ANY)?.data.message}</Alert>}
      {data && <PageHeader title={data.apiKey} showBackButton />}
      <Grid spacing={2} container>
        <Grid xs={6} item>
          <Paper sx={{ p: 3 }}>{data && <EditApiKeyForm apiKey={data} />}</Paper>
        </Grid>
      </Grid>
    </Page>
  )
}

export default ApiKeyEditPage
