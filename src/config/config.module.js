import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: `./${process.env.NODE_ENV}.env`,
      load: [configuration]
    })
  ]
})
export class ConfigModule {}
