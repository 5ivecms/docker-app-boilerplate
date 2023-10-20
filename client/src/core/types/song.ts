import { Artist } from './artist'
import { Genre } from './genre'
import { Release } from './release'

export type Song = {
  id: number
  title: string
  release: Release
  artists: Artist[]
  genres: Genre[]
  isActive: boolean
  hasError: boolean
  createdAt: Date
}
