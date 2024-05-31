import { Module } from '@nestjs/common';
import {
  TypeOrmModule,
  getRepositoryToken,
  getCustomRepositoryToken
} from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import customRepository from './users.repository';
import { UserTag } from './user-tag.entity';
import { UsersInitializer } from './users.initializer';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserTag]), StorageModule],
  controllers: [UsersController],
  providers: [
    {
      provide: getCustomRepositoryToken(User),
      inject: [getRepositoryToken(User)],
      useFactory: (repository) => repository.extend(customRepository)
    },
    UsersInitializer
  ]
})
export class UsersModule {}