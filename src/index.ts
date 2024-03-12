import router from './routes';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(router);

app.listen(port, () => {
  console.log(`[Server]: Server is running at http://localhost:${port}`);
});