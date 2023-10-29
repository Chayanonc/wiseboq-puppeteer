import { Client } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

export const clientPostgres = () => {
  const client = new Client({
    host: process.env.PG_HOST ? process.env.PG_HOST : "localhost",
    port: process?.env?.PG_PORT ? +process?.env?.PG_PORT : 5432,
    database: process?.env?.PG_DATABASE ? process?.env?.PG_DATABASE : "",
    user: process?.env?.PG_USER ? process?.env?.PG_USER : "",
    password: process?.env?.PG_PASSWORD ? process?.env?.PG_PASSWORD : "",
  });

  return client;
};
