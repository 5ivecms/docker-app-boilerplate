export const ApiEndpoints = {
  auth: {
    refresh: (): string => `/auth/refresh`,
    signIn: (): string => `/auth/signin`,
    logout: (): string => `/auth/logout`,
    changePassword: (): string => `/auth/change-password`,
  },

  xApiKey: {
    clear: (): string => `/x-api-key/clear`,
    create: (): string => `/x-api-key`,
    delete: (id: number): string => `/x-api-key/${id}`,
    deleteBulk: (): string => `/x-api-key/delete-bulk`,
    findAll: (): string => '/x-api-key',
    findOne: (id: number): string => `/x-api-key/${id}`,
    search: (): string => '/x-api-key/search',
    update: (id: number): string => `/x-api-key/${id}`,
  },

  site: {
    clear: (): string => `/site/clear`,
    create: (): string => `/site`,
    delete: (id: number): string => `/site/${id}`,
    deleteBulk: (): string => `/site/delete-bulk`,
    findAll: (): string => '/site',
    findOne: (id: number): string => `/site/${id}`,
    search: (): string => '/site/search',
    update: (id: number): string => `/site/${id}`,
  },
}
