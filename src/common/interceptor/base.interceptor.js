import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class BaseInterceptor {
  process(data) {
    return data;
  }

  intercept(context, next) {
    return next.handle().pipe(map((data) => this.process(data)));
  }
}
