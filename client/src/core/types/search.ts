export type SortDirection = 'asc' | 'desc'

export type Sort<T> = {
  id: keyof T
  desc: boolean
}

export type Search = Record<string, string>

export type SearchQueryParams<T> = { page?: number; take?: number; relations?: string[] } & {
  filter: Record<string, { mode: string; value: string | number | boolean | string[] | number[] }>
  sort?: Sort<T>[]
}
