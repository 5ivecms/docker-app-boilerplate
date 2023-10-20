import { IsNumber } from 'class-validator'

export class DeleteBulkSiteDto {
  @IsNumber({}, { each: true })
  readonly ids: number
}
