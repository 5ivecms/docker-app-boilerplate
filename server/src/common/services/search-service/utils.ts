import { object } from 'dot-object'
import {
  And,
  Between,
  EntityMetadata,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm'
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata'

import { FilterMode, FilterValue } from './types'

export const DEFAULT_RESPONSE = { items: [], total: 0, page: 1, take: 10 }

export const getFieldTypes = (entityMetadata: EntityMetadata, relations: object) => {
  let fieldTypes = getEntityColumnTypes(entityMetadata.ownColumns)

  Object.entries(relations).map(([key, value]) => {
    const relation = entityMetadata.ownRelations.find((relation) => relation.propertyName === key)
    if (typeof value === 'boolean') {
      fieldTypes = { ...fieldTypes, [key]: getEntityColumnTypes(relation.inverseEntityMetadata.ownColumns) }
      return
    }
    fieldTypes = { ...fieldTypes, [key]: getFieldTypes(relation.inverseEntityMetadata, relations[key]) }
  })

  return fieldTypes
}

export const getEntityColumnTypes = (columnsMetaData: ColumnMetadata[]): object => {
  return columnsMetaData.reduce((acc, column) => {
    if (typeof column.type === 'function') {
      return { ...acc, [column.propertyName]: typeof column.type() }
    }
    return { ...acc, [column.propertyName]: column.type }
  }, {})
}

export const getRelations = (relations: string[]) => {
  let preparedRelations = {}

  if (relations !== undefined && relations.length > 0) {
    preparedRelations = relations
      .filter((item, index) => {
        return !relations.some((otherItem, otherIndex) => {
          return index !== otherIndex && otherItem.includes(item)
        })
      })
      .reduce((acc, item) => ({ ...acc, [item]: true }), {})
  }

  return object(preparedRelations)
}

export const prepareOrder = (orderData: { id: string; desc: string }[]) => {
  return object(
    orderData.reduce((acc, item) => {
      const desc = item.desc === 'true' ? 'DESC' : 'ASC'
      return { ...acc, [item.id]: desc }
    }, {})
  )
}

export const getStringOperator = (value: string, mode: FilterMode) => {
  const str = String(value)

  if (mode === 'equals') {
    return Equal(str)
  }

  if (mode === 'contains') {
    return ILike(`%${str}%`)
  }

  if (mode === 'startsWith') {
    return ILike(`${str}%`)
  }

  if (mode === 'endsWith') {
    return ILike(`%${str}`)
  }

  return value
}

export const getNumberOperator = (value: FilterValue, mode: FilterMode) => {
  const numValue = Number(value) || 0

  if (Array.isArray(value) && mode === 'arrIncludesSome') {
    return In(value.map(Number))
  }

  if (String(value).toLocaleLowerCase() === 'null') {
    return IsNull()
  }

  if ((mode === 'fuzzy' && value === ' ') || (mode === 'equals' && value === ' ')) {
    return Not(IsNull())
  }

  if (mode === 'fuzzy') {
    return numValue
  }

  if (mode === 'equals') {
    return Equal(numValue)
  }

  if (mode === 'notEquals') {
    return Not(numValue)
  }

  if (mode === 'greaterThan') {
    return MoreThan(numValue)
  }

  if (mode === 'greaterThanOrEqualTo') {
    return MoreThanOrEqual(numValue)
  }

  if (mode === 'lessThan') {
    return LessThan(numValue)
  }

  if (mode === 'lessThanOrEqualTo') {
    return LessThanOrEqual(numValue)
  }

  if (mode === 'between') {
    if (!Array.isArray(value)) {
      return Not(IsNull())
    }

    const min = Number(value[0])
    const max = Number(value[1])

    if (min && max) {
      return And(MoreThan(min), LessThan(max))
    }
    if (min && !max) {
      return MoreThan(min)
    }
    if (!min && max) {
      return LessThan(max)
    }

    return Not(IsNull())
  }

  if (mode === 'betweenInclusive') {
    if (!Array.isArray(value)) {
      return Not(IsNull())
    }

    const min = Number(value[0])
    const max = Number(value[1])

    if (min && max) {
      return And(MoreThanOrEqual(min), LessThanOrEqual(max))
    }
    if (min && !max) {
      return MoreThanOrEqual(min)
    }
    if (!min && max) {
      return LessThanOrEqual(max)
    }

    return Not(IsNull())
  }

  return numValue
}

export const getBooleanOperator = (value: string | boolean, mode: FilterMode) => {
  let bool = false
  if (typeof value === 'string') {
    bool = value === 'true' ? true : false
  } else {
    bool = value
  }

  if (mode === 'equals' || mode === 'fuzzy') {
    return Equal(bool)
  }

  return bool
}

export const getDateOperator = (value: string[], mode: FilterMode) => {
  const startOf = new Date(value[0])
  const endOf = new Date(value[1])
  startOf.setUTCHours(0, 0, 0, 0)
  endOf.setUTCHours(23, 59, 59, 999)

  if (mode === 'fuzzy') {
    return Between(startOf, endOf)
  }

  return Between(startOf, endOf)
}

export const BOOLEAN_TYPES = ['bool', 'boolean']

export const LIKABLE_TYPES = [
  'character varying',
  'varying character',
  'char varying',
  'nvarchar',
  'national varchar',
  'character',
  'native character',
  'varchar',
  'char',
  'nchar',
  'national char',
  'varchar2',
  'nvarchar2',
  'alphanum',
  'shorttext',
  'raw',
  'binary',
  'varbinary',
  'string',
  'text',
]

export const NOT_LIKABLE_TYPES = [
  'float',
  'double',
  'dec',
  'decimal',
  'smalldecimal',
  'fixed',
  'numeric',
  'real',
  'double precision',
  'number',
  'tinyint',
  'smallint',
  'mediumint',
  'int',
  'bigint',
  'int2',
  'integer',
  'int4',
  'int8',
  'int64',
  'unsigned big int',
  'float',
  'float4',
  'float8',
  'float64',
]

export const DATE_TYPES = [
  'datetime',
  'datetime2',
  'datetimeoffset',
  'time',
  'time with time zone',
  'time without time zone',
  'timestamp',
  'timestampz',
  'timestamptz',
  'timestamp without time zone',
  'timestamp with time zone',
  'timestamp with local time zone',
]
