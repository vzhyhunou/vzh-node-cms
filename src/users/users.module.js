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
import { UserResource } from './user.resource';
import { StorageModule } from '../storage/storage.module';
import { UserSubscriber } from './user.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserTag]), StorageModule],
  controllers: [UsersController],
  providers: [
    {
      provide: getCustomRepositoryToken(User),
      inject: [getRepositoryToken(User)],
      useFactory: (repository) => repository.extend(customRepository)
    },
    UserResource,
    UserSubscriber
  ],
  exports: [getCustomRepositoryToken(User)]
})
export class UsersModule {}
