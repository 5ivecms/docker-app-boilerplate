import { IsNumberString, IsOptional, IsString } from 'class-validator'

import { FilterMode, FilterValue } from './types'

export class SearchDto<T> {
  @IsOptional()
  @IsNumberString()
  public readonly page?: number

  @IsOptional()
  @IsNumberString()
  public readonly take?: number

  @IsOptional()
  public readonly filter?: Record<string, { mode: FilterMode; value: FilterValue }>

  @IsOptional()
  public readonly sort?: Array<{ id: string; desc: string }>

  @IsString({ each: true })
  @IsOptional()
  public readonly relations?: string[]
}
