import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { SearchDto } from '../../common/services/search-service/search.dto'
import { CreateXApiKeyDto, DeleteBulkXApiKeysDto, UpdateXApiKeyDto } from './dto'
import { XApiKeyEntity } from './x-api-key.entity'
import { XApiKeyService } from './x-api-key.service'

@Controller('x-api-key')
export class XApiKeyController {
  constructor(private readonly xApiKeyService: XApiKeyService) {}

  @UseGuards(AuthGuard(['jwt']))
  @Get()
  public findAll() {
    return this.xApiKeyService.findAll()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('search')
  public search(@Query() dto: SearchDto<XApiKeyEntity>) {
    return this.xApiKeyService.search(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get(':id')
  public findOne(@Param('id') id: number) {
    return this.xApiKeyService.findOne(Number(id))
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post()
  public create(@Body() dto: CreateXApiKeyDto) {
    return this.xApiKeyService.create(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Patch(':id')
  public update(@Body() dto: UpdateXApiKeyDto, @Param('id') id: number) {
    return this.xApiKeyService.update(+id, dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post('generate')
  public generateApiKey() {
    return this.xApiKeyService.generateApiKey()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('delete-bulk')
  public deleteBulk(@Body() dto: DeleteBulkXApiKeysDto) {
    return this.xApiKeyService.deleteBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.xApiKeyService.delete(Number(id))
  }
}
