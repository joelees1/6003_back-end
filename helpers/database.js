/** This module contains a utility function to run an SQL query
 * @module helpers/database
 * @see models/* for database query functions
 * @requires mysql2/promise
 * @requires config
 * @requires uuid
*/

const mysql = require('mysql2/promise');
const info = require('../config');
const { v4: uuidv4 } = require('uuid');

/** Run an SQL query against the DB, end the connection and return the result.
 * @param {string} Query SQL query string in sqljs format
 * @param {array|number|string} values The values to inject in to the query string.
 * @returns {object} mysqljs results object containing indexable rows
 * @throws {DatabaseException} Custom exception for DB query failures
*/

exports.run_query = async function run_query(query, values) {
  try {
    const connection = await mysql.createConnection(info.config);
    let data = await connection.query(query, values);
    await connection.end();
    return data;
  } catch (error) {
    const errorId = uuidv4();
    throw new DatabaseException(error.message, error.code, errorId);
  }
}

/** Custom exception for DB query failures
 * @param {string} message - The error message
 * @param {number|string} code - The error code
 * @param {string} id - The error unique ID
*/

function DatabaseException(message, code, id) {
  this.message = message;
  this.code = code;
  this.id = id;
  this.name = 'DatabaseException';
}