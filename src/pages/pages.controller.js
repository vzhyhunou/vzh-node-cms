import {
  Controller,
  Dependencies,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Post,
  Bind,
  Param,
  Request,
  UseInterceptors
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getCustomRepositoryToken } from '@nestjs/typeorm';

import { Page } from './page.entity';
import { PAGES } from './constants';
import { USER_TAG } from '../users/constants';
import { ParsePagePipe, PatchPagePipe } from './configuration';
import { Roles } from '../auth/roles.decorator';
import { AuditItemPipe } from '../auth/audit-item.pipe';
import { ItemsController } from '../common/controller/items.controller';
import { OnePageInterceptor } from './one.page.interceptor';
import { ItemInterceptor } from '../common/interceptor/item.interceptor';
import { MenuPageInterceptor } from './menu.page.interceptor';

@Controller(`api/${PAGES}`)
@Roles(USER_TAG.PAGES_EDITOR)
@Dependencies(getCustomRepositoryToken(Page), EventEmitter2)
export class PagesController extends ItemsController {
  constructor(repository, eventEmitter) {
    super(repository, eventEmitter, Page);
  }

  @Post()
  @Bind(Body(ParsePagePipe, AuditItemPipe))
  async create(entity) {
    return await super.create(entity);
  }

  @Put(':id')
  @Bind(Body(ParsePagePipe, AuditItemPipe))
  async update(entity) {
    return await super.update(entity);
  }

  @Patch(':id')
  @Bind(Body(PatchPagePipe, ParsePagePipe, AuditItemPipe))
  async patch(entity) {
    return await super.update(entity);
  }

  @Delete(':id')
  @Bind(Param('id'))
  async remove(id) {
    await super.remove(id);
  }

  @Get('search/one/:id')
  @Roles()
  @Bind(Param('id'), Request())
  @UseInterceptors(OnePageInterceptor, ItemInterceptor)
  async one(id, request) {
    return await this.repository.one(
      id,
      request.isUserInRole(USER_TAG.PAGES_EDITOR)
    );
  }

  @Get('search/menu')
  @Roles()
  @UseInterceptors(MenuPageInterceptor)
  async menu() {
    return await this.repository.menu();
  }
}
