import { XApiKeyModel } from './x-api-key'

export type SiteModel = {
  id: number
  domain: string
  createdAt: Date
  updatedAt: Date
  xApiKey: XApiKeyModel
}

export type CreateSiteDto = {
  domain: string
}

export type UpdateSiteDto = Partial<CreateSiteDto>
