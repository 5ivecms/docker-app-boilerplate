import { IsOptional, IsString } from 'class-validator'

export class CreateXApiKeyDto {
  @IsString()
  @IsOptional()
  public readonly comment?: string
}
