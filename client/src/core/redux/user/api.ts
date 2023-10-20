import { createApi } from '@reduxjs/toolkit/query/react'

import { User } from '../../types/user'
import { setUser } from '../auth/slice'
import { baseQueryWithRefreshToken } from '../baseQuery'

export const UserApi = createApi({
  reducerPath: 'UserApi',
  baseQuery: baseQueryWithRefreshToken,
  endpoints: (builder) => ({
    profile: builder.query<User, null>({
      query() {
        return {
          url: 'user/profile',
          method: 'GET',
        }
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser(data))
          // eslint-disable-next-line no-empty
        } catch (error) {}
      },
    }),
  }),
})
