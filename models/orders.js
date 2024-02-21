/** This module contains functions for interacting with the orders table in the DB
 * @module models/orders
 * @requires helpers/database
 * @see routes/orders for the routes that use these functions
 */

const db = require('../helpers/database');

/** Get all orders
 * @async
 * @param {integer} userId - user id
 * @returns {Promise} - Promise object returns the orders
 */
exports.getAll = async function getAllOrders (userId) {
    // get all rows from the orders table
    let query = "SELECT * FROM orders";
    let values = [];

    if (userId) { // if a user id is provided, get all orders belonging to that user
        query += " WHERE user_id = ?";
        values = [userId];
    }

    const data = await db.run_query(query, values);
    return data;
}

/** Add a new order to the orders table
 * @async
 * @param {object} order - New order object
 * @returns {Promise} - Promise object returns the results of the insert query
 */
exports.add = async function addOrder (order) {
    let query = "INSERT INTO orders SET ?";
    let data = await db.run_query(query, order);
    return data;
}

/** Get a single order by its id
 * @async
 * @param {integer} id - order id
 * @returns {Promise} - Promise object (data) represents the order
 */
exports.getById = async function getOrderById (id) {
    let query = "SELECT * FROM orders WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

/** Update an order in the orders table
 * @async
 * @param {integer} orderId - order id
 * @param {object} order - new order values object
 * @returns {Promise} - Promise object represents the result of the db update query
 */
exports.update = async function updateOrder (orderId, order) {
    let query = "UPDATE orders SET ? WHERE ID = ?";
    let values = [order, orderId];
    let data = await db.run_query(query, values);
    return data;
}

/** Delete an order from the orders table
 * @async
 * @param {integer} id - order id
 * @returns {Promise} - Promise object represents the result of the db delete query
 */
exports.delete = async function deleteOrder (id) {
    let query = "DELETE FROM orders WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}