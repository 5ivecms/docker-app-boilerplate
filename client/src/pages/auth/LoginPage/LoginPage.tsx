/* eslint-disable import/no-extraneous-dependencies */
import { Box, Paper } from '@mui/material'
import { Helmet } from 'react-helmet-async'
import { Navigate } from 'react-router-dom'

import { LoginForm } from '../../../components/auth'
import { BrowseRoutes } from '../../../core/config/routes'
import { selectCurrentUser } from '../../../core/redux/auth/selectors'
import { useAppSelector } from '../../../core/redux/store'
import { styles } from './styles'

const LoginPage = () => {
  const user = useAppSelector(selectCurrentUser)

  if (user) {
    return <Navigate to={BrowseRoutes.admin.index()} replace />
  }

  return (
    <>
      <Helmet>
        <title>Авторизация</title>
      </Helmet>
      <Box sx={styles.container}>
        <Paper sx={styles.paper}>
          <LoginForm />
        </Paper>
      </Box>
    </>
  )
}

export default LoginPage
