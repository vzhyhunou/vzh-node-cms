import { Controller, Dependencies, Bind, Get, Query } from '@nestjs/common';

import { USER_TAG } from '../users/constants';
import { Roles } from '../auth/roles.decorator';
import { ExportService } from './export.service';

@Controller('export')
@Roles(USER_TAG.ADMIN)
@Dependencies(ExportService)
export class ExportController {
  constructor(exportService) {
    this.exportService = exportService;
  }

  @Get()
  @Bind(Query())
  export({ incremental }) {
    this.exportService.export(incremental);
  }
}
