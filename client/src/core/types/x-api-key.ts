export interface XApiKeyModel {
  id: number
  apiKey: string
  comment: string
  createdAt: Date
  updatedAt: Date
}

export type CreateXApiKeyDto = {
  comment: string
}

export type XApiKeyUpdateDto = {
  id: number
  comment?: string
}
