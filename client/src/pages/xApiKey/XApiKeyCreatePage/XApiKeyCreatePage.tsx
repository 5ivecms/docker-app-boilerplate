import { Grid, Paper } from '@mui/material'

import { Page } from '../../../components/common'
import { PageHeader } from '../../../components/ui'
import { CreateApiKeyForm } from './components'

const title = 'X-API-KEY'

const XApiKeyCreatePage = () => (
  <Page title={title}>
    <PageHeader title={title} showBackButton />
    <Grid spacing={2} container>
      <Grid xs={4} item>
        <Paper sx={{ p: 3 }}>
          <CreateApiKeyForm />
        </Paper>
      </Grid>
    </Grid>
  </Page>
)

export default XApiKeyCreatePage
