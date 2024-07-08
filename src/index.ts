import { AppDataSource } from './data-source';
import errorHandler from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import { tokenDecode } from './middleware/token.middleware';
import router from './routes';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

void (async function mainModule() {
  try {
    await AppDataSource.initialize();

    app.use(express.json());
    app.use(cookieParser());
    app.use(tokenDecode);

    app.use('/api', router);

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`[Server]: Server is running at http://localhost:${port}`);
    });
  } catch (error: any) {
    console.error('Error starting the server', error);
  }
})();
