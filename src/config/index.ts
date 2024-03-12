interface DatabaseConfig {
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_PORT: number;
}

export const DBConfig: DatabaseConfig = {
  DB_HOST: process.env.DB_HOST ?? '127.0.0.1',
  DB_USER: process.env.DB_USER ?? 'admin',
  DB_PASSWORD: process.env.DB_PASSWORD ?? 'password',
  DB_NAME: process.env.DB_NAME ?? 'linkbud',
  DB_PORT: parseInt(process.env.DB_PORT ?? '5432', 10)
};
