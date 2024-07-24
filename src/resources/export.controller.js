import { Controller, Dependencies, Bind, Get, Query } from '@nestjs/common';
import { ExportService } from './export.service';

@Controller('export')
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
