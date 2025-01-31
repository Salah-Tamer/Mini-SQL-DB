// lib/storage.js

/**
 * @module storage
 * @description handled file-based storage operations
 */

import fs from "fs";
import "dotenv/config";
import { logError, logInfo } from "../logger/logger.js";
import path from "path";

export const DATABASE_PATH = process.env.MINI_SQL_DB || "./database/";

// create the database directory if it doesn't exist
if (!fs.existsSync(DATABASE_PATH)) {
  fs.mkdirSync(DATABASE_PATH, { recursive: true });
  logInfo(`Database directory created: ${DATABASE_PATH}`);
}

/**
 * Gets the file path for table's schema or data file
 * @param {string} tableName - the name of the table
 * @param {string} fileType - the type of the file
 * @returns {string} - the file path
 */

export function getTableFilePath(tableName, fileType = "data") {
  return path.join(DATABASE_PATH, `${tableName}.${fileType}.json`);
}

/**
 * Reads a json file and returns its content
 * @param {string} filePath - path of json file
 * @returns {object|null} - Parsed json content or null it file doesn't exist
 */

export function readJSON(filePath) {
  const parsedData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : null;
  if (!parsedData) {
    logError(`File not found: ${filePath}`);
  }
  return parsedData;
}

/**
 * Writes data to a JSON file
 * @param {string} filePath - file of the json file
 * @param {object} data - Data to write
 */

export function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  //TODO: write validation for filePath and return error if not found
}
