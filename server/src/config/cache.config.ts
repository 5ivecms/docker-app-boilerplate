import { registerAs } from '@nestjs/config'

export type CacheConfig = {
  apiKeyCacheTtl: number
}

export default registerAs('cache', () => ({
  apiKeyCacheTtl: +process.env.API_KEY_CACHE_TTL,
}))
