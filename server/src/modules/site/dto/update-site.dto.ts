import { IsOptional, IsString } from 'class-validator'

export class UpdateSiteDto {
  @IsString()
  @IsOptional()
  public readonly domain?: string
}
