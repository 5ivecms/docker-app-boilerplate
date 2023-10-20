import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { XApiKeyModule } from '../x-api-key/x-api-key.module'
import { SiteController } from './site.controller'
import { Site } from './site.entity'
import { SiteService } from './site.service'

@Module({
  imports: [TypeOrmModule.forFeature([Site]), XApiKeyModule],
  controllers: [SiteController],
  providers: [SiteService],
  exports: [SiteService],
})
export class SiteModule {}
