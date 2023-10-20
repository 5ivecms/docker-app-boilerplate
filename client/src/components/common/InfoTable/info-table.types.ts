import type { ReactNode } from 'react'

import { ANY } from '../../../core/types'

export type InfoTableColumn<T> = {
  field: keyof T
  headerName: string
  render?: (data: ANY) => ReactNode
  width?: string
}
