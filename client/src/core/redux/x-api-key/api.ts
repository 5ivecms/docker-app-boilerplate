import { createApi } from '@reduxjs/toolkit/query/react'
import { stringify } from 'qs'

// eslint-disable-next-line import/no-extraneous-dependencies
import { ApiEndpoints } from '../../api/endpoints'
import { DeleteResponse, FindAllResponse, UpdateResponse } from '../../types/response'
import { SearchQueryParams } from '../../types/search'
import { CreateXApiKeyDto, XApiKeyModel, XApiKeyUpdateDto } from '../../types/x-api-key'
import { baseQueryWithRefreshToken } from '../baseQuery'

export const XApiKeyApi = createApi({
  reducerPath: 'XApiKeyApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['ApiKeys'],
  endpoints: (builder) => ({
    findOne: builder.query<XApiKeyModel, number>({
      query(id) {
        return {
          url: ApiEndpoints.xApiKey.findOne(id),
          method: 'GET',
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'ApiKeys', id }],
    }),
    search: builder.query<FindAllResponse<XApiKeyModel>, SearchQueryParams<XApiKeyModel>>({
      query(params) {
        return {
          url: `${ApiEndpoints.xApiKey.search()}/?${stringify(params, { encode: false })}`,
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'ApiKeys' as const,
                id,
              })),
              { type: 'ApiKeys', id: 'LIST' },
            ]
          : [{ type: 'ApiKeys', id: 'LIST' }],
    }),
    clear: builder.mutation<DeleteResponse, void>({
      query() {
        return {
          url: ApiEndpoints.xApiKey.clear(),
          method: 'DELETE',
        }
      },
      invalidatesTags: ['ApiKeys'],
    }),
    create: builder.mutation<XApiKeyModel, CreateXApiKeyDto>({
      query(data) {
        return {
          url: ApiEndpoints.xApiKey.create(),
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: [{ type: 'ApiKeys', id: 'LIST' }],
    }),
    update: builder.mutation<UpdateResponse, XApiKeyUpdateDto>({
      query({ id, ...data }) {
        return {
          url: ApiEndpoints.xApiKey.update(id),
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, _, { id }) =>
        result
          ? [
              { type: 'ApiKeys', id },
              { type: 'ApiKeys', id: 'LIST' },
            ]
          : [{ type: 'ApiKeys', id: 'LIST' }],
    }),
    delete: builder.mutation<DeleteResponse, number>({
      query(id) {
        return {
          url: ApiEndpoints.xApiKey.delete(id),
          method: 'DELETE',
        }
      },
      invalidatesTags: [{ type: 'ApiKeys', id: 'LIST' }],
    }),
    deleteBulk: builder.mutation<DeleteResponse, number[]>({
      query(ids) {
        return {
          url: ApiEndpoints.xApiKey.deleteBulk(),
          method: 'DELETE',
          body: { ids },
        }
      },
      invalidatesTags: (result, _, ids) =>
        result
          ? [
              ...ids.map((id) => ({
                type: 'ApiKeys' as const,
                id,
              })),
              { type: 'ApiKeys', id: 'LIST' },
            ]
          : [{ type: 'ApiKeys', id: 'LIST' }],
    }),
  }),
})
