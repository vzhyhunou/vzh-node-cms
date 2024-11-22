import { Dependencies, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ExportService } from './export.service';

@Injectable()
@Dependencies(ConfigService, SchedulerRegistry, ExportService)
export class ExportScheduler {
  constructor(configService, schedulerRegistry, exportService) {
    this.properties = configService.get('resources.exp');
    this.schedulerRegistry = schedulerRegistry;
    this.exportService = exportService;
  }

  onModuleInit() {
    if (this.properties.full.cron) {
      const job = new CronJob(this.properties.full.cron, () =>
        this.exportService.export(false)
      );
      this.schedulerRegistry.addCronJob('full', job);
      job.start();
    }

    if (this.properties.inc.cron) {
      const job = new CronJob(this.properties.inc.cron, () =>
        this.exportService.export(true)
      );
      this.schedulerRegistry.addCronJob('inc', job);
      job.start();
    }
  }
}
