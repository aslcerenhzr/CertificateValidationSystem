"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Certificate_1 = require("../entities/Certificate");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: +process.env.DB_PORT || 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "123",
    database: process.env.DB_NAME || "certificate",
    synchronize: true, // For dev only
    logging: false,
    entities: [User_1.User, Certificate_1.Certificate], // direct references
});
