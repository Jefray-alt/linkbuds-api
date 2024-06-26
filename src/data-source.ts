import { DBConfig } from './config';
import path from 'path';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DBConfig.DB_HOST,
  port: DBConfig.DB_PORT,
  username: DBConfig.DB_USER,
  password: DBConfig.DB_PASSWORD,
  database: DBConfig.DB_NAME,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  /**
   *  Should use JS or else it will fail on compile.
   *  Reference: https://github.com/nestjs/nest/issues/4283#issuecomment-597987321
   **/
  entities: [path.join(__dirname, '/../**/*.entity{.js,.ts}')],
  subscribers: [],
  migrations: []
});
