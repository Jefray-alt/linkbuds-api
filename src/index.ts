import { AppDataSource } from './data-source';
import router from './routes';
import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to PostgreSQL');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

app.use(router);

app.listen(port, () => {
  console.log(`[Server]: Server is running at http://localhost:${port}`);
});
