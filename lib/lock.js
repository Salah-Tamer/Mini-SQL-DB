// lib/lock.js

/**
 * @module lock
 * @description Implements table-level locking using mutex.
 */

import Mutex from "./mutex.js";
import { logInfo } from "../logger/logger.js";

const tableLocks = new Map();

/**
 * Acquires the lock for the table.
 * @param {string} tableName - which table to lock
 * @returns {Promise<Function>} - A promise that resolves to an unlock function
 */
export async function lockTable(tableName) {
  if (!tableLocks.has(tableName)) {
    tableLocks.set(tableName, new Mutex());
    logInfo(`[Lock] Mutex created for table "${tableName}"`);
  }

  const mutex = tableLocks.get(tableName);
  const unlock = await mutex.lock();
  logInfo(`[Lock] lock acquired for table "${tableName}"`);

  return unlock;
}

/**
 * Executes a callback function with a table lock.
 * @param {string} tableName - The name of the table to lock.
 * @param {Function} callback - The operation to execute when the table is locked.
 */
export async function performWithLock(tableName, callback) {
  const unlock = await lockTable(tableName);
  try {
    logInfo(`[Lock] performing operation on table "${tableName}"`);
    await callback();
  } catch (error) {
    logInfo(`[Lock] Error during operation on table "${tableName}"`);
    throw error;
  } finally {
    unlock();
    logInfo(`[Lock] lock released for table "${tableName}"`);
  }
}
