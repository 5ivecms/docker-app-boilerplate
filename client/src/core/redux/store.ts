import type { AnyAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import type { Dispatch } from 'react'
import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'

import { AuthApi } from './auth/api'
import auth from './auth/slice'
import { SiteApi } from './site/api'
import { UserApi } from './user/api'
import { XApiKeyApi } from './x-api-key/api'

export const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  reducer: {
    [AuthApi.reducerPath]: AuthApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [XApiKeyApi.reducerPath]: XApiKeyApi.reducer,
    [SiteApi.reducerPath]: SiteApi.reducer,
    auth,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({}),
    AuthApi.middleware,
    UserApi.middleware,
    XApiKeyApi.middleware,
    SiteApi.middleware,
  ],
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = (): Dispatch<AnyAction> => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
