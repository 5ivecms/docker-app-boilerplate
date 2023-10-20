/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query/react'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ApiEndpoints } from '../api/endpoints'
import { API_URL } from '../config/api'
import { BrowseRoutes } from '../config/routes'
import { Tokens } from '../types/auth'
import { TokenService } from '../utils/tokens'
import { logOut } from './auth/slice'

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const token = TokenService.getAccessToken() || ''
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const baseQueryWithRefreshToken = async (args: FetchArgs | string, api: BaseQueryApi, extraOptions: object) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 401) {
    const refreshToken = TokenService.getRefreshToken() || ''

    const refreshResult = await baseQuery(
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
        url: ApiEndpoints.auth.refresh(),
      },
      api,
      extraOptions
    )

    if (refreshResult?.data) {
      TokenService.setTokens(refreshResult.data as Tokens)
      result = await baseQuery(args, api, extraOptions)
    } else {
      TokenService.removeTokens()
      api.dispatch(logOut())
      if (window.location.pathname.indexOf(BrowseRoutes.auth.login()) === -1) {
        window.location.href = BrowseRoutes.auth.login()
      }
    }
  }

  return result
}
