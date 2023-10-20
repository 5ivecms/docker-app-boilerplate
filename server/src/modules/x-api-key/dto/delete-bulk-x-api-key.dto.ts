import { IsNumber } from 'class-validator'

export class DeleteBulkXApiKeysDto {
  @IsNumber({}, { each: true })
  readonly ids: number
}
