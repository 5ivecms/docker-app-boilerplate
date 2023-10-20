import { Release } from './release'
import { Song } from './song'

export type Genre = {
  id: number
  title: string
  releases: Release[]
  songs: Song[]
}
