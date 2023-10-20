export interface FindAllResponse<I> {
  items: I[]
  take: number
  page: number
  total: number
}

export type DeleteResponse = {
  affected: number
  raw: number[]
}

export type UpdateResponse = {
  affected: number
  generatedMaps: number[]
  raw: number[]
}
