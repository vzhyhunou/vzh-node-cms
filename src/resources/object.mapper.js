import { Injectable, Dependencies } from '@nestjs/common';
import fs from 'fs';
import { deserialize, instanceToPlain } from 'class-transformer';

import { MappingsService } from '../storage/mappings.service';

@Injectable()
@Dependencies(MappingsService)
export class ObjectMapper {
  constructor(mappingsService, groups) {
    this.mappingsService = mappingsService;
    this.groups = groups;
  }

  readValue(file, type) {
    return deserialize(type, fs.readFileSync(file), {
      mappingsService: this.mappingsService,
      groups: this.groups
    });
  }

  writeValue(file, obj) {
    fs.writeFileSync(
      file,
      JSON.stringify(
        instanceToPlain(obj, {
          mappingsService: this.mappingsService,
          groups: this.groups
        }),
        (key, value) => (value ? value : undefined),
        2
      )
    );
  }
}
