/** This module contains functions for interacting with the addresses table in the DB
 * @module models/addresses
 * @requires helpers/database
 * @see routes/addresses for the routes that use these functions
 */

const db = require('../helpers/database');

/** Get all addresses belonging to a user
 * @async
 * @param {integer} id - user id
 * @returns {Promise} - Promise object represents the addresses (data)
 */
exports.getAll = async function getAllAddresses (id) {
    let query = "SELECT * FROM addresses WHERE user_id = ?";
    let values = [id];
    const data = await db.run_query(query, values);
    return data;
}

/** Get a single address by its id belonging to a user
 * @async
 * @param {integer} addressId - address id
 * @param {integer} userId - user id
 * @returns {Promise} - Promise object represents the address (data)
 */
exports.getById = async function getAddressById (addressId, userId) {
    // get a single address by its id belonging to a user
    let query = "SELECT * FROM addresses WHERE ID = ? AND user_id = ?";
    let values = [addressId, userId];
    let data = await db.run_query(query, values);
    return data;
}

/** Add a new address to the addresses table
 * @async
 * @param {object} address - address object
 * @returns {Promise} - Promise object represents the result of the db query
 */
exports.add = async function addAddress (address) {
    let query = "INSERT INTO addresses SET ?";
    let data = await db.run_query(query, address);
    return data;
}

/** Update an address in the addresses table
 * @async
 * @param {integer} addressId - address id
 * @param {integer} userId - user id
 * @param {object} address - address object
 * @returns {Promise} - Promise object represents the result of the db query
 */
exports.update = async function updateAddress (addressId, userId, address) {
    // only allow the owner of the address to update it
    let query = "UPDATE addresses SET ? WHERE ID = ? AND user_id = ?";
    let values = [address, addressId, userId];
    let data = await db.run_query(query, values);
    return data;
}

/** Delete an address from the addresses table
 * @async
 * @param {integer} addressId - address id
 * @param {integer} userId - user id
 * @returns {Promise} - Promise object represents the result of the db query
 */
exports.delete = async function deleteAddress (addressId, userId) {
    // only allow the owner of the address to delete it
    let query = "DELETE FROM addresses WHERE ID = ? AND user_id = ?";
    let values = [addressId, userId];
    let data = await db.run_query(query, values);
    return data;
}
