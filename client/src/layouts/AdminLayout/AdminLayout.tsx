/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/require-default-props */
import { Box, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'

import { Footer, Header } from '../../components/common'
import { container, main } from './AdminLayout.styles'

const AdminLayout = () => (
  <Box sx={main}>
    <Header />
    <Container sx={container} maxWidth="xl">
      <Outlet />
    </Container>
    <Footer />
  </Box>
)

export default AdminLayout
