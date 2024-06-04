import { Injectable, Dependencies } from '@nestjs/common';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
@Dependencies(getCustomRepositoryToken(User))
export class AuthService {
  constructor(repository) {
    this.repository = repository;
  }

  async validateUser(username, password) {
    const user = await this.repository.withActiveRoles(username);
    return (
      user &&
      bcrypt.compareSync(password, user.password) && {
        username,
        authorities: user.tags.map(({ name }) => name)
      }
    );
  }
}
