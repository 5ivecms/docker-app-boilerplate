import { IsOptional, IsString } from 'class-validator'

export class UpdateXApiKeyDto {
  @IsString()
  @IsOptional()
  public readonly comment?: string
}
