export type FilterMode =
  // Для строк
  | 'contains'
  | 'startsWith'
  | 'endsWith'

  // Общие
  | 'fuzzy'
  | 'empty'
  | 'notEmpty'
  | 'equals'
  | 'notEquals'

  // Числа, даты
  | 'between'
  | 'betweenInclusive'
  | 'greaterThan'
  | 'greaterThanOrEqualTo'
  | 'lessThan'
  | 'lessThanOrEqualTo'
  | 'arrIncludes'
  | 'arrIncludesAll'
  | 'arrIncludesSome'
  | 'weakEquals'
  | 'inNumberRange'

export type FilterValue = string | string[] | number | boolean

export const stringFilterModes: FilterMode[] = ['contains', 'startsWith', 'endsWith']
