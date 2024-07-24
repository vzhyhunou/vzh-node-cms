import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatasourceModule } from './datasource/datasource.module';
import { ConfigModule } from './config/config.module';
import { ResourcesModule } from './resources/resources.module';
import { AuthModule } from './auth/auth.module';
import { StaticModule } from './static/static.module';
import { PagesModule } from './pages/pages.module';
import { I18nModule } from './i18n/i18n.module';

@Module({
  imports: [
    ConfigModule,
    DatasourceModule,
    UsersModule,
    PagesModule,
    ResourcesModule,
    AuthModule,
    StaticModule,
    I18nModule
  ]
})
export class AppModule {}
