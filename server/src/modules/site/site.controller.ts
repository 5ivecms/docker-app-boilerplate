import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { SearchDto } from '../../common/services/search-service/search.dto'
import { CreateSiteDto, DeleteBulkSiteDto, UpdateSiteDto } from './dto'
import { Site } from './site.entity'
import { SiteService } from './site.service'

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @UseGuards(AuthGuard(['jwt']))
  @Get()
  public findAll() {
    return this.siteService.findAll()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('search')
  public search(@Query() dto: SearchDto<Site>) {
    return this.siteService.search(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get(':id')
  public findOne(@Param('id') id: number) {
    return this.siteService.findOne(Number(id))
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post()
  public create(@Body() dto: CreateSiteDto) {
    return this.siteService.create(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Patch(':id')
  public update(@Body() dto: UpdateSiteDto, @Param('id') id: number) {
    return this.siteService.update(Number(id), dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('delete-bulk')
  public deleteBulk(@Body() dto: DeleteBulkSiteDto) {
    return this.siteService.deleteBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.siteService.delete(Number(id))
  }
}
