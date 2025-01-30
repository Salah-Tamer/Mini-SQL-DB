// lib/storage.js

/**
 * @module storage
 * @description handled file-based storage operations
 */

import fs from "fs";
import "dotenv/config";
import { logInfo } from "../logger/logger.js";

export const DATABASE_PATH = process.env.MINI_SQL_DB || "./database/";

if (!fs.existsSync(DATABASE_PATH)) {
  fs.mkdirSync(DATABASE_PATH, { recursive: true });
  logInfo(`Database directory created: ${DATABASE_PATH}`);
}
