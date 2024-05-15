import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { ResourcesModule } from './resources/resources.module';
@Module({
  imports: [ConfigModule, DatabaseModule, UsersModule, ResourcesModule]
})
export class AppModule {}
