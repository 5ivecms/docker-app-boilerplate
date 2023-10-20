import { Grid, Paper, Typography } from '@mui/material'
import React from 'react'

import { PageHeader } from '../../../components/ui'
import { selectCurrentUser } from '../../../core/redux/auth/selectors'
import { useAppSelector } from '../../../core/redux/store'
import { ChangePasswordForm, Profile } from './components'
import { formTitle, paper } from './UserProfilePage.styles'

const UserProfilePage = () => {
  const user = useAppSelector(selectCurrentUser)
  return (
    <>
      <PageHeader title="Профиль" />
      <Grid spacing={2} container>
        <Grid xs={4} item>
          <Paper sx={paper}>
            {user && <Profile user={user} />}
            <Typography variant="h6" sx={formTitle}>
              Сменить пароль
            </Typography>
            <ChangePasswordForm />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default UserProfilePage
