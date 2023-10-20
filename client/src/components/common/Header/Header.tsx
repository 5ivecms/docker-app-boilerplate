import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { BrowseRoutes } from '../../../core/config/routes'
import { AuthApi } from '../../../core/redux/auth/api'
import { headerMenu } from './menu'
import { appBar, headerRight, linkMenu, linksContainer, logoText, toolbar } from './styles'

const Header = () => {
  const [logout] = AuthApi.useLogoutMutation()

  const handleLogout = () => {
    logout()
  }

  return (
    <AppBar sx={appBar} position="static">
      <Container maxWidth="xl">
        <Toolbar sx={toolbar} disableGutters>
          <Typography component={Link} sx={logoText} to={BrowseRoutes.admin.index()} variant="h6" noWrap>
            YoutubeAPI
          </Typography>

          <Box sx={linksContainer}>
            {headerMenu.map((item) => (
              <Button key={item.url} component={Link} sx={linkMenu} to={item.url}>
                {item.title}
              </Button>
            ))}
          </Box>
          <Box sx={headerRight}>
            <Button component={Link} sx={linkMenu} to={BrowseRoutes.admin.user.profile()}>
              Профиль
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Выйти
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
