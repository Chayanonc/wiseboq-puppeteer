import { Client } from "pg";
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import "reflect-metadata"
import { Products } from "../entities/items.entity";
import { SchedulePrices } from "../entities/schedulePrices.entity";
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

export const appDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432, // default port of postgres
  username: process?.env?.PG_USER ? process?.env?.PG_USER : "postgres",
  password: process?.env?.PG_PASSWORD ? process?.env?.PG_PASSWORD : "",
  database: process?.env?.PG_DATABASE ? process?.env?.PG_DATABASE : "",
  entities: [
    // typeORM will not be able to create database table if we forget to put entity class name here..
    Products,
    SchedulePrices,
  ],
  synchronize: true,
  logging: false,
});
