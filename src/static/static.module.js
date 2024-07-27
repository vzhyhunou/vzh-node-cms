import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './configuration';

@Module({
  imports: [
    ConfigModule.forFeature(config),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService) =>
        configService
          .get('static.locations')
          .split(',')
          .map((l) => ({
            rootPath: join(process.cwd(), l),
            exclude: ['/api/(.*)', '/static/(.*)', '/assets/(.*)']
          })),
      inject: [ConfigService]
    })
  ]
})
export class StaticModule {}
