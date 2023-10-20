import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { XApiKeyController } from './x-api-key.controller'
import { XApiKeyEntity } from './x-api-key.entity'
import { XApiKeyService } from './x-api-key.service'

@Module({
  imports: [TypeOrmModule.forFeature([XApiKeyEntity]), ConfigModule],
  controllers: [XApiKeyController],
  providers: [XApiKeyService],
  exports: [XApiKeyService],
})
export class XApiKeyModule {}
