import { Release } from './release'
import { Song } from './song'

export type Artist = {
  id: number
  title: string
  songs: Song[]
  releases: Release[]
}
