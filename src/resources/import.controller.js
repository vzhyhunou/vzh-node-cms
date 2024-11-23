import { Controller, Dependencies, Get } from '@nestjs/common';

import { USER_TAG } from '../users/constants';
import { Roles } from '../auth/roles.decorator';
import { ImportService } from './import.service';

@Controller('import')
@Roles(USER_TAG.ADMIN)
@Dependencies(ImportService)
export class ImportController {
  constructor(importService) {
    this.importService = importService;
  }

  @Get()
  export() {
    this.importService.imp();
  }
}
