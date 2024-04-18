import { Column } from 'typeorm';

export function DateColumn(options) {
  return Column({ type: 'datetime', ...options });
}
