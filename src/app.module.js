import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatasourceModule } from './datasource/datasource.module';
import { ConfigModule } from './config/config.module';
import { ResourcesModule } from './resources/resources.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    DatasourceModule,
    UsersModule,
    ResourcesModule,
    AuthModule
  ]
})
export class AppModule {}
