import { Alert, Grid, Paper } from '@mui/material'
import { useParams } from 'react-router-dom'

import { Page } from '../../../components/common'
import { PageHeader } from '../../../components/ui'
import { SiteApi } from '../../../core/redux/site/api'
import { ANY } from '../../../core/types'
import { EditSiteForm } from './components'

const SiteEditPage = () => {
  const params = useParams()
  const { id } = params
  const { data, isLoading, isError, error } = SiteApi.useFindOneQuery(Number(id))

  const title = data?.domain || ''

  return (
    <Page title={title} loading={isLoading}>
      {isError && error && <Alert severity="error">{(error as ANY)?.data.message}</Alert>}
      {data && <PageHeader title={title} showBackButton />}
      <Grid spacing={2} container>
        <Grid xs={6} item>
          <Paper sx={{ p: 3 }}>{data && <EditSiteForm site={data} />}</Paper>
        </Grid>
      </Grid>
    </Page>
  )
}

export default SiteEditPage
