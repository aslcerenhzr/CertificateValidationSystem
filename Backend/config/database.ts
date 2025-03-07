import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Certificate } from "../entities/Certificate";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: +process.env.DB_PORT! || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "123",
  database: process.env.DB_NAME || "certificate",
  synchronize: true, // For dev only
  logging: false,
  entities: [User, Certificate], // direct references
});
