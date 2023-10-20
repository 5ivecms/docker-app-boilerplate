import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SearchService } from 'src/common/services/search-service/search.service'
import { DeleteResult, Repository } from 'typeorm'

import { XApiKeyService } from '../x-api-key/x-api-key.service'
import { CreateSiteDto, DeleteBulkSiteDto, UpdateSiteDto } from './dto'
import { Site } from './site.entity'

@Injectable()
export class SiteService extends SearchService<Site> {
  constructor(
    @InjectRepository(Site) private readonly siteRepository: Repository<Site>,
    private readonly xApiKeyService: XApiKeyService
  ) {
    super(siteRepository)
  }

  public findAll(): Promise<Site[]> {
    return this.siteRepository.find({ relations: { xApiKey: true } })
  }

  public findOne(id: number): Promise<Site> {
    return this.siteRepository.findOneBy({ id })
  }

  public async create(dto: CreateSiteDto) {
    const xApiKey = await this.xApiKeyService.create({ comment: `${dto.domain}` })

    const site = new Site()
    site.domain = dto.domain
    site.xApiKey = xApiKey

    return this.siteRepository.save(site)
  }

  public async update(id: number, dto: UpdateSiteDto) {
    const site = await this.siteRepository.findOneBy({ id })

    if (!site) {
      throw new NotFoundException('Site not found')
    }

    return this.siteRepository.update(id, dto)
  }

  public deleteBulk(dto: DeleteBulkSiteDto) {
    const { ids } = dto
    return this.siteRepository.delete(ids)
  }

  public delete(id: number): Promise<DeleteResult> {
    return this.siteRepository.delete(id)
  }
}
