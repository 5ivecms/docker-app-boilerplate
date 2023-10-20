import { object, pick } from 'dot-object'
import { type Repository } from 'typeorm'

import type { SearchDto } from './search.dto'
import {
  BOOLEAN_TYPES,
  DATE_TYPES,
  DEFAULT_RESPONSE,
  getBooleanOperator,
  getDateOperator,
  getFieldTypes,
  getNumberOperator,
  getRelations,
  getStringOperator,
  LIKABLE_TYPES,
  NOT_LIKABLE_TYPES,
  prepareOrder,
} from './utils'

export class SearchService<T> {
  constructor(private readonly repository: Repository<T>) {}

  public async search(dto: SearchDto<T>) {
    let { relations, filter, sort, page, take } = dto

    take = take || 10
    take > 100 ? 100 : take

    page = page || 1
    page < 1 ? 1 : page

    const skip = (page - 1) * take
    const order = prepareOrder(sort ?? [])

    const relationsObj = getRelations(relations ?? [])
    const fieldTypes = getFieldTypes(this.repository.metadata, relationsObj)

    let where = {}

    if (filter && Object.keys(filter).length > 0) {
      where = Object.entries(filter).reduce((acc, [field, { value, mode }]) => {
        const fieldType = pick(field, fieldTypes)

        if (DATE_TYPES.includes(fieldType)) {
          if (Array.isArray(value) && value.length === 2 && value[0].length && value[1].length) {
            return { ...acc, [field]: getDateOperator(value, mode) }
          }
          return acc
        }

        if (BOOLEAN_TYPES.includes(fieldType)) {
          if (typeof value === 'string' || typeof value === 'boolean') {
            return { ...acc, [field]: getBooleanOperator(value, mode) }
          }
          return acc
        }

        if (LIKABLE_TYPES.includes(fieldType)) {
          return { ...acc, [field]: getStringOperator(value.toString(), mode) }
        }

        if (NOT_LIKABLE_TYPES.includes(fieldType)) {
          return { ...acc, [field]: getNumberOperator(value, mode) }
        }

        return acc
      }, {})
    }

    try {
      const [items, total] = await this.repository.findAndCount({
        relations: relationsObj,
        where: object(where),
        skip,
        take,
        order,
      })
      return { items, total, page, take }
    } catch (e) {
      return DEFAULT_RESPONSE
    }
  }
}
