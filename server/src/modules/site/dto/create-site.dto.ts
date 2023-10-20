import { IsString } from 'class-validator'

export class CreateSiteDto {
  @IsString()
  public readonly domain: string
}
