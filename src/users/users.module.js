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

@Module({
  imports: [TypeOrmModule.forFeature([User, UserTag])],
  controllers: [UsersController],
  providers: [
    {
      provide: getCustomRepositoryToken(User),
      inject: [getRepositoryToken(User)],
      useFactory: (repository) => repository.extend(customRepository)
    }
  ]
})
export class UsersModule {}
