import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'hello world'
  });
});

app.listen(port, () => {
  console.log(`[Server]: Server is running at http://localhost:${port}`);
});
