import { createApi } from '@reduxjs/toolkit/query/react'

import { ApiEndpoints } from '../../api/endpoints'
import { BrowseRoutes } from '../../config/routes'
import { ChangePasswordFormFields, ChangePasswordResponse, LoginFields, LoginResponse } from '../../types/auth'
import { TokenService } from '../../utils/tokens'
import { baseQueryWithRefreshToken } from '../baseQuery'
import { logOut, setUser } from './slice'

export const AuthApi = createApi({
  reducerPath: 'AuthApi',
  baseQuery: baseQueryWithRefreshToken,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginFields>({
      query(data) {
        return {
          body: data,
          method: 'POST',
          url: ApiEndpoints.auth.signIn(),
        }
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { tokens, user },
          } = await queryFulfilled
          TokenService.setTokens(tokens)
          dispatch(setUser(user))
          // eslint-disable-next-line no-empty
        } catch (error) {}
      },
    }),
    logout: builder.mutation<void, void>({
      query() {
        return {
          url: ApiEndpoints.auth.logout(),
          method: 'GET',
        }
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          TokenService.removeTokens()
          dispatch(logOut())
          window.location.href = BrowseRoutes.auth.login()
          // eslint-disable-next-line no-empty
        } catch (error) {}
      },
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordFormFields>({
      query(data) {
        return {
          body: data,
          method: 'POST',
          url: ApiEndpoints.auth.changePassword(),
        }
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const {
            data: { tokens },
          } = await queryFulfilled
          TokenService.setTokens(tokens)
          // eslint-disable-next-line no-empty
        } catch (error) {}
      },
    }),
  }),
})

export const { useLoginMutation, useChangePasswordMutation } = AuthApi
