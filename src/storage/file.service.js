import { Dependencies, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs';

@Injectable()
@Dependencies(ConfigService)
export class FileService {
  logger = new Logger(FileService.name);

  constructor(configService) {
    this.root = configService.get('storage.origin');
  }

  create(location, files) {
    try {
      this.write(location, files);
    } catch (e) {
      this.clean(location, []);
      throw e;
    }
  }

  update(oldLocation, newLocation, newFiles) {
    //collect all files
    const oldFiles = this.read(oldLocation, true);

    //clean removed files
    this.clean(oldLocation, newFiles);

    //collect exist files
    const keepFiles = this.read(oldLocation, true);

    //clean exist files
    this.clean(oldLocation, []);

    //add exist files
    const names = keepFiles.map(({ name }) => name);
    newFiles = newFiles.filter(({ name }) => !names.includes(name));
    newFiles = [...newFiles, ...keepFiles];

    try {
      this.write(newLocation, newFiles);
    } catch (e) {
      this.clean(newLocation, []);
      this.write(oldLocation, oldFiles);
      throw e;
    }
  }

  read(location, addFiles) {
    const dir = path.join(this.root, location);
    const files = [];
    if (!fs.existsSync(dir)) {
      return files;
    }
    for (const name of fs.readdirSync(dir)) {
      const filepath = path.join(dir, name);
      const stat = fs.statSync(filepath);
      if (stat.isFile()) {
        const file = { name };
        if (addFiles) {
          this.logger.debug(`Read: ${filepath}`);
          const b = fs.readFileSync(filepath);
          file.data = Buffer.from(b).toString('base64');
        }
        files.push(file);
      }
    }
    return files;
  }

  parents(location) {
    return location
      .split(path.sep)
      .reduce(
        (sum, current) =>
          sum.concat(
            sum.length ? path.join(sum[sum.length - 1], current) : current
          ),
        []
      )
      .reverse();
  }

  clean(location, files) {
    const dir = path.join(this.root, location);
    if (!fs.existsSync(dir)) {
      return;
    }
    const names = files.map(({ name }) => name);
    for (const name of fs.readdirSync(dir)) {
      if (!names.includes(name)) {
        const filepath = path.join(dir, name);
        const stat = fs.statSync(filepath);
        if (stat.isFile()) {
          this.logger.debug(`Remove: ${filepath}`);
          fs.rmSync(filepath);
        }
      }
    }
    for (const name of this.parents(location)) {
      const filepath = path.join(this.root, name);
      if (fs.readdirSync(filepath).length) {
        return;
      }
      this.logger.debug(`Remove dir: ${filepath}`);
      fs.rmdirSync(filepath);
    }
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
