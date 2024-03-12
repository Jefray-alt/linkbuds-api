import { DBConfig } from '../config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: DBConfig.DB_HOST,
  port: DBConfig.DB_PORT,
  username: DBConfig.DB_USER,
  password: DBConfig.DB_PASSWORD,
  database: DBConfig.DB_NAME
});

export default sequelize;
