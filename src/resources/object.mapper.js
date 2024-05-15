import { Injectable, Dependencies } from '@nestjs/common';
import { getEntityManagerToken } from '@nestjs/typeorm';
import fs from 'fs';
import { plainToInstance } from 'class-transformer';
import { MappingsService } from '../storage/mappings.service';

@Injectable()
@Dependencies(getEntityManagerToken(), MappingsService)
export class ObjectMapper {
  constructor(manager, mappingsService, groups) {
    this.manager = manager;
    this.mappingsService = mappingsService;
    this.groups = groups;
  }

  readValue(filepath, type) {
    const item = JSON.parse(fs.readFileSync(filepath));
    return plainToInstance(type, item, {
      manager: this.manager,
      mappingsService: this.mappingsService,
      groups: this.groups
    });
  }
}
