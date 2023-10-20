import { createBrowserRouter } from 'react-router-dom'

import { BrowseRoutes } from '../core/config/routes'
import { AdminLayout } from '../layouts'
import { LoginPage } from '../pages/auth'
import { HomePage } from '../pages/main'
import { SiteCreatePage, SiteEditPage, SiteIndexPage, SiteViewPage } from '../pages/site'
import { UserProfilePage } from '../pages/user'
import { XApiKeyCreatePage, XApiKeyEditPage, XApiKeyIndexPage, XApiKeyViewPage } from '../pages/xApiKey'

export const router = createBrowserRouter([
  {
    path: BrowseRoutes.auth.login(),
    element: <LoginPage />,
  },
  {
    path: BrowseRoutes.admin.index(),
    element: <AdminLayout />,
    children: [
      {
        path: BrowseRoutes.admin.index(),
        element: <HomePage />,
      },
      {
        path: BrowseRoutes.admin.xApiKey.index(),
        children: [
          {
            path: BrowseRoutes.admin.xApiKey.index(),
            element: <XApiKeyIndexPage />,
          },
          {
            path: BrowseRoutes.admin.xApiKey.create(),
            element: <XApiKeyCreatePage />,
          },
          {
            path: BrowseRoutes.admin.xApiKey.edit(),
            element: <XApiKeyEditPage />,
          },
          {
            path: BrowseRoutes.admin.xApiKey.view(),
            element: <XApiKeyViewPage />,
          },
        ],
      },
      {
        path: BrowseRoutes.admin.site.index(),
        children: [
          {
            path: BrowseRoutes.admin.site.index(),
            element: <SiteIndexPage />,
          },
          {
            path: BrowseRoutes.admin.site.create(),
            element: <SiteCreatePage />,
          },
          {
            path: BrowseRoutes.admin.site.edit(),
            element: <SiteEditPage />,
          },
          {
            path: BrowseRoutes.admin.site.view(),
            element: <SiteViewPage />,
          },
        ],
      },
      {
        path: BrowseRoutes.admin.user.profile(),
        element: <UserProfilePage />,
      },
    ],
  },
])
