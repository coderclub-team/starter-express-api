import { SequelizeOptions } from "sequelize-typescript";
import path from "node:path";
import multer from "multer";
import { Request } from "express";

export const sequelizeConnectionOptions: SequelizeOptions = {
  dialect: "mssql",
  host: "154.61.74.30",
  port: 1533,
  username: "gkdairy",
  password: "yinq9327YI",
  database: "GKDairy",
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  

  dialectOptions: {
    options: {
      encrypt: false,
      requestTimeout: 300000,
      
    },
    setTimeout: 100000,
    clearTimeout: 50000,
  
  },
  // models: [__dirname + "/**/*.model.ts"],
};

export const employeeImageUploadOptions = {
  directory: path.join("users"),
  relativePath: "public/users/",
  limits: { fileSize: 1024 * 1024 * 1 },
};
export const userImageUploadOptions = {
  directory: path.join("users"),
  tmpFilePath: path.join("public/tmp"),
  relativePath: "public/users/",
  limits: { fileSize: 1024 * 1024 * 1 },

  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/tmp");
    },
    filename: (req, file, cb) => {
      // a unique name for the file with the original extension
      cb(null, `${Date.now()}.${file.originalname.split(".").pop()}`);
    },
  }),
};
export const productImageUploadOptions = {
  directory: path.join("products"),
  tmpFilePath: path.join("public/tmp"),
  relativePath: "public/products/",
  limits: { fileSize: 1024 * 1024 * 2 },

  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/products");
    },
    filename: (req, file, cb) => {
      // a unique name for the file with the original extension
      cb(null, `${Date.now()}.${file.originalname.split(".").pop()}`);
    },
  }),
};

export const CategoryImageUploadOptions = {
  directory: path.join("categories"),
  tmpFilePath: path.join("public/tmp"),
  relativePath: "public/categories/",
  limits: { fileSize: 1024 * 1024 * 2 },

  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/categories");
    },
    filename: (req, file, cb) => {
      // a unique name for the file with the original extension
      cb(null, `${Date.now()}.${file.originalname.split(".").pop()}`);
    },
  }),
};
