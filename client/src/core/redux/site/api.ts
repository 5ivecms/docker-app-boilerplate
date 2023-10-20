import { createApi } from '@reduxjs/toolkit/query/react'
import { stringify } from 'qs'

import { ApiEndpoints } from '../../api/endpoints'
import { DeleteResponse, FindAllResponse, UpdateResponse } from '../../types/response'
import { SearchQueryParams } from '../../types/search'
import { CreateSiteDto, SiteModel, UpdateSiteDto } from '../../types/site'
import { baseQueryWithRefreshToken } from '../baseQuery'

export const SiteApi = createApi({
  reducerPath: 'siteApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['Sites'],
  endpoints: (builder) => ({
    findOne: builder.query<SiteModel, number>({
      query(id) {
        return {
          url: ApiEndpoints.site.findOne(id),
          method: 'GET',
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Sites', id }],
    }),
    search: builder.query<FindAllResponse<SiteModel>, SearchQueryParams<SiteModel>>({
      query(params) {
        return {
          url: `${ApiEndpoints.site.search()}/?${stringify(params, { encode: false })}`,
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'Sites' as const,
                id,
              })),
              { type: 'Sites', id: 'LIST' },
            ]
          : [{ type: 'Sites', id: 'LIST' }],
    }),
    clear: builder.mutation<DeleteResponse, void>({
      query() {
        return {
          url: ApiEndpoints.site.clear(),
          method: 'DELETE',
        }
      },
      invalidatesTags: ['Sites'],
    }),
    create: builder.mutation<SiteModel, CreateSiteDto>({
      query(data) {
        return {
          url: ApiEndpoints.site.create(),
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: [{ type: 'Sites', id: 'LIST' }],
    }),
    update: builder.mutation<UpdateResponse, { id: number; data: UpdateSiteDto }>({
      query({ id, data }) {
        return {
          url: ApiEndpoints.site.update(id),
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, _, { id }) =>
        result
          ? [
              { type: 'Sites', id },
              { type: 'Sites', id: 'LIST' },
            ]
          : [{ type: 'Sites', id: 'LIST' }],
    }),
    delete: builder.mutation<DeleteResponse, number>({
      query(id) {
        return {
          url: ApiEndpoints.site.delete(id),
          method: 'DELETE',
        }
      },
      invalidatesTags: [{ type: 'Sites', id: 'LIST' }],
    }),
    deleteBulk: builder.mutation<DeleteResponse, number[]>({
      query(ids) {
        return {
          url: ApiEndpoints.site.deleteBulk(),
          method: 'DELETE',
          body: { ids },
        }
      },
      invalidatesTags: (result, _, ids) =>
        result
          ? [
              ...ids.map((id) => ({
                type: 'Sites' as const,
                id,
              })),
              { type: 'Sites', id: 'LIST' },
            ]
          : [{ type: 'Sites', id: 'LIST' }],
    }),
  }),
})
