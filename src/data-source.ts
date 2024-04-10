import { DBConfig } from './config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DBConfig.DB_HOST,
  port: DBConfig.DB_PORT,
  username: DBConfig.DB_USER,
  password: DBConfig.DB_PASSWORD,
  database: DBConfig.DB_NAME,
  synchronize: true,
  logging: true,
  /**
   *  Should use JS or else it will fail on compile.
   *  Reference: https://github.com/nestjs/nest/issues/4283#issuecomment-597987321
   **/
  entities: ['dist/**/*.entity.js'],
  subscribers: [],
  migrations: []
});
