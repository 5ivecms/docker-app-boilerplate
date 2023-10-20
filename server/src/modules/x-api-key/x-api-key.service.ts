import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { randomBytes } from 'crypto'
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm'

import { SearchService } from '../../common/services/search-service/search.service'
import { CacheConfig } from '../../config/cache.config'
import { CreateXApiKeyDto, DeleteBulkXApiKeysDto, UpdateXApiKeyDto } from './dto'
import { API_KEY_CACHE_KEY, getApiKeyСompositeCacheKey } from './x-api-key.constants'
import { XApiKeyEntity } from './x-api-key.entity'

@Injectable()
export class XApiKeyService extends SearchService<XApiKeyEntity> {
  constructor(
    @InjectRepository(XApiKeyEntity) private readonly xApiKeyRepository: Repository<XApiKeyEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService
  ) {
    super(xApiKeyRepository)
  }

  public async findAll(): Promise<XApiKeyEntity[]> {
    const apiKeysCache = await this.cacheManager.get<XApiKeyEntity[]>(API_KEY_CACHE_KEY)
    if (apiKeysCache) {
      return apiKeysCache
    }

    const { apiKeyCacheTtl } = this.configService.get<CacheConfig>('cache')
    const apiKeys = await this.xApiKeyRepository.find()
    await this.cacheManager.set(API_KEY_CACHE_KEY, apiKeys, apiKeyCacheTtl)

    return apiKeys
  }

  public async findOne(id: number): Promise<XApiKeyEntity> {
    const apiKeyCache = await this.cacheManager.get<XApiKeyEntity>(getApiKeyСompositeCacheKey(id))
    if (apiKeyCache) {
      return apiKeyCache
    }

    const apiKey = await this.xApiKeyRepository.findOneBy({ id })

    if (!apiKey) {
      throw new NotFoundException('ApiKey not Found')
    }

    const { apiKeyCacheTtl } = this.configService.get<CacheConfig>('cache')

    await this.cacheManager.set(getApiKeyСompositeCacheKey(id), apiKey, apiKeyCacheTtl)

    return apiKey
  }

  public async findOneByApiKey(apiKey: string): Promise<XApiKeyEntity> {
    const apiKeyCache = await this.cacheManager.get<XApiKeyEntity>(getApiKeyСompositeCacheKey(`api-key-${apiKey}`))
    if (apiKeyCache) {
      return apiKeyCache
    }

    const apiKeyEntity = await this.xApiKeyRepository.findOneBy({ apiKey })

    if (!apiKeyEntity) {
      throw new NotFoundException('ApiKey not Found')
    }

    const { apiKeyCacheTtl } = this.configService.get<CacheConfig>('cache')
    await this.cacheManager.set(getApiKeyСompositeCacheKey(`api-key-${apiKey}`), apiKeyEntity, apiKeyCacheTtl)

    return apiKeyEntity
  }

  public async findOneBy(where: FindOptionsWhere<XApiKeyEntity> = {}): Promise<XApiKeyEntity> {
    const apiKey = await this.xApiKeyRepository.findOneBy(where)

    if (!apiKey) {
      throw new NotFoundException('ApiKey not Found')
    }

    return apiKey
  }

  public async create(dto: CreateXApiKeyDto): Promise<XApiKeyEntity> {
    const { apiKey } = this.generateApiKey()
    await this.clearCache()
    return this.xApiKeyRepository.save({ apiKey, ...dto })
  }

  public async update(id: number, dto: UpdateXApiKeyDto) {
    const entity = await this.xApiKeyRepository.findOne({ where: { id } })

    if (!entity) {
      throw new NotFoundException('Api key not found')
    }

    await this.clearCache()

    return this.xApiKeyRepository.update(id, dto)
  }

  public async deleteBulk(dto: DeleteBulkXApiKeysDto) {
    const { ids } = dto
    await this.clearCache()
    return this.xApiKeyRepository.delete(ids)
  }

  public async delete(id: number): Promise<DeleteResult> {
    await this.clearCache()
    return this.xApiKeyRepository.delete(id)
  }

  public generateApiKey(): { apiKey: string } {
    return { apiKey: randomBytes(20).toString('hex') }
  }

  public async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys()
    await Promise.all(
      keys.map(async (key) => {
        if (key.startsWith(API_KEY_CACHE_KEY)) {
          await this.cacheManager.del(key)
        }
      })
    )
  }
}
