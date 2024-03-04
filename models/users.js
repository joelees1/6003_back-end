/** This module contains functions for interacting with the users table in the DB
 * @module models/users
 * @requires helpers/database
 * @see routes/users for the routes that use these functions
 */

const db = require('../helpers/database');

/** Get a single user by its username, used for authentication
 * @async
 * @param {string} username - username
 * @returns {Promise} - Promise object represents the user from the db
 */
exports.findByUsername = async function getByUsername (username) {
    const query = "SELECT * FROM users WHERE username = ?";
    const value = [username];
    const user = await db.run_query(query, value);
    return user;
}  

/** Get all users
 * @async
 * @param {integer} page - page number
 * @param {integer} limit - number of users per page
 * @param {string} order - order by column
 * @returns {Promise} - Promise object represents the users (data)
 */
exports.getAll = async function getAllUsers () {
    // get all rows from the users table, without password
    let query = "SELECT * FROM users";
    const data = await db.run_query(query);
    return data;
}

/** Get a single user by its id
 * @async
 * @param {integer} id - user id
 * @returns {Promise} - Promise object (data) represents the user
 */
exports.getById = async function getById (id) {
    // get all rows from the users table, filtered by role in routes
    let query = "SELECT * FROM users WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

/** Add a new user to the users table
 * @async
 * @param {object} user - new user object
 * @returns {Promise} - Promise object represents the result of the db query
 */
exports.add = async function addUser (user) {
    let query = "INSERT INTO users SET ?";
    let data = await db.run_query(query, user);
    return data;
}

/** Update a user in the users table
 * @async
 * @param {integer} id - user id
 * @param {object} user - new user values object
 * @returns {Promise} - Promise object represents the result of the db update query
 */
exports.update = async function updateUser (id, user) {
    let query = "UPDATE users SET ? WHERE ID = ?";
    let values = [user, id];
    let data = await db.run_query(query, values);
    return data;
}

/** Delete a user from the users table
 * @async
 * @param {integer} id - user id
 * @returns {Promise} - Promise object represents the result of the db delete query
 */
exports.delete = async function deleteUser (id) {
    let query = "DELETE FROM users WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}
