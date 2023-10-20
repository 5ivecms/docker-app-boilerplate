import { BrowseRoutes } from '../../../core/config/routes'
import type { HeaderMenuItem } from './header.interfaces'

export const headerMenu: HeaderMenuItem[] = [
  { title: 'X-API-KEYS', url: BrowseRoutes.admin.xApiKey.index() },
  { title: 'Сайты', url: BrowseRoutes.admin.site.index() },
]
