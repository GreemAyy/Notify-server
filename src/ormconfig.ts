import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default {
  type: 'mysql',
  database: '_notify',
  username: 'root',
  password: '',
  host: 'localhost',
  port: 3306,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false
} as TypeOrmModuleOptions;
