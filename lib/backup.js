// lib/backup.js

/**
 * @module backup
 * @description Handles database backup and restore functionality.
 */

import fs, { readdirSync } from "fs";
import { DATABASE_PATH } from "./storage.js";
import path from "path";
import { logError, logSuccess } from "../logger/logger.js";

/**
 * Backup the entire database folder to another specified directory.
 * @param {string} backupPath - The directory to save the backup.
 */

export function backupDatabase(backupPath) {
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }

  const files = readdirSync(DATABASE_PATH);

  files.forEach((file) => {
    const source = path.join(DATABASE_PATH, file);
    const destination = path.join(backupPath, file);
    fs.copyFileSync(source, destination);
  });

  logSuccess(`Database backup completed successfully! Available at: ${backupPath}`);
}

/**
 * Restores the database from a backup directory.
 * @param {string} backupPath - The directory containing the backup files.
 */

export function restoreDatabase(backupPath) {
  if (!fs.existsSync(backupPath)) {
    logError("Backup directory doesn't exist");
    throw new Error("Backup directory doesn't exist");
  }

  const files = readdirSync(backupPath);
  files.forEach((file) => {
    const source = path.join(backupPath, file);
    const destination = path.join(DATABASE_PATH, file);
    fs.copyFileSync(source, destination);
  });

  logSuccess(`Database restored from ${backupPath} to ${DATABASE_PATH} successfully!`);
}
