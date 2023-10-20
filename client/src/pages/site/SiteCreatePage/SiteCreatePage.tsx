import { Grid, Paper } from '@mui/material'

import { PageHeader } from '../../../components/ui'
import { CreateSiteForm } from './components'

const SiteCreatePage = () => (
  <>
    <PageHeader title="Добавить сайт" showBackButton />
    <Grid spacing={2} container>
      <Grid xs={4} item>
        <Paper sx={{ p: 3 }}>
          <CreateSiteForm />
        </Paper>
      </Grid>
    </Grid>
  </>
)

export default SiteCreatePage
