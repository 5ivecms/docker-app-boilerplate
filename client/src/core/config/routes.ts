const ADMIN_PATH = '/admin'

export const BrowseRoutes = {
  auth: {
    login: (): string => `/login`,
  },

  user: {
    profile: (): string => `/profile`,
  },

  base: {
    home: (): string => `/`,
    notFound: (): string => `*`,
  },

  admin: {
    index: (): string => ADMIN_PATH,

    user: {
      profile: (): string => `${ADMIN_PATH}/profile`,
    },

    xApiKey: {
      create: (): string => `${ADMIN_PATH}/x-api-key/create`,
      edit: (id: number | string = ':id'): string => `${ADMIN_PATH}/x-api-key/edit/${id}`,
      index: (): string => `${ADMIN_PATH}/x-api-key`,
      view: (id: number | string = ':id'): string => `${ADMIN_PATH}/x-api-key/view/${id}`,
    },

    site: {
      create: (): string => `${ADMIN_PATH}/site/create`,
      edit: (id: number | string = ':id'): string => `${ADMIN_PATH}/site/edit/${id}`,
      index: (): string => `${ADMIN_PATH}/site`,
      view: (id: number | string = ':id'): string => `${ADMIN_PATH}/site/view/${id}`,
    },
  },
}
