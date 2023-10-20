import { Artist } from './artist'
import { Genre } from './genre'
import { Song } from './song'

export type Release = {
  id: number
  title: string
  year: number
  songs: Song[]
  artists: Artist[]
  genres: Genre[]
}
