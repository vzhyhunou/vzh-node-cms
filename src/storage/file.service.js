import { Dependencies, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs';

@Injectable()
@Dependencies(ConfigService)
export class FileService {
  logger = new Logger(FileService.name);

  constructor(configService) {
    this.root = configService.get('cms.files.path');
  }

  create(location, files) {
    this.write(location, files);
  }

  read(location, addFiles) {
    const dir = path.join(this.root, location);
    const files = [];
    if (!fs.existsSync(dir)) {
      return files;
    }
    for (const name of fs.readdirSync(dir)) {
      const file = { name };
      if (addFiles) {
        const filepath = path.join(dir, name);
        this.logger.debug(`Read: ${filepath}`);
        const b = fs.readFileSync(filepath);
        file.data = Buffer.from(b).toString('base64');
      }
      files.push(file);
    }
    return files;
  }

  write(location, files) {
    const dir = path.join(this.root, location);
    for (const { name, data } of files) {
      if (data) {
        const out = path.join(dir, name);
        this.logger.debug(`Write: ${out}`);
        const b = Buffer.from(data, 'base64');
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(out, b);
      }
    }
  }
}
