import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatasourceModule } from './datasource/datasource.module';
import { ConfigModule } from './config/config.module';
import { ResourcesModule } from './resources/resources.module';
import { AuthModule } from './auth/auth.module';
import { StaticModule } from './static/static.module';

@Module({
  imports: [
    ConfigModule,
    DatasourceModule,
    UsersModule,
    ResourcesModule,
    AuthModule,
    StaticModule
  ]
})
export class AppModule {}
