import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import Strategy from 'passport-headerapikey'

import { XApiKeyService } from '../../../modules/x-api-key/x-api-key.service'

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private readonly apiKeyService: XApiKeyService) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey: any, done: any) => {
      return this.validate(apiKey, done)
    })
  }

  public async validate(apiKey: string, done: (error: Error, data) => {}) {
    try {
      const existApiKey = await this.apiKeyService.findOneBy({ apiKey })

      if (existApiKey) {
        done(null, true)
      }
      done(new UnauthorizedException(), null)
    } catch (e) {
      done(new UnauthorizedException(), null)
    }
  }
}
