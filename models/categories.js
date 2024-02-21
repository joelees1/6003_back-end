/** This module contains functions for interacting with the categories table in the DB
 * @module models/categories
 * @requires helpers/database
 * @see routes/categories for the routes that use these functions
 */

const db = require('../helpers/database');

/** Get all categories
 * @async
 * @returns {Promise} - Promise object represents the categories (data)
*/
exports.getAll = async function getAllCategories () {
    // get all rows from the categories table
    let query = "SELECT * FROM categories";
    const data = await db.run_query(query);
    return data;
}

/** Add a new category to the categories table
 * @async
 * @param {object} category - New category object
 * @returns {Promise} - Promise object returns the results of the insert query
*/
exports.add = async function addCategory (category) {
    let query = "INSERT INTO categories SET ?";
    let data = await db.run_query(query, category);
    return data;
}

/** Get a single category by its id
 * @async
 * @param {integer} id - category id
 * @returns {Promise} - Promise object (data) represents the category
*/
exports.getById = async function getCategoryById (id) {
    let query = "SELECT * FROM categories WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

/** Update a category in the categories table
 * @async
 * @param {integer} categoryId - category id
 * @param {object} category - new category values object
 * @returns {Promise} - Promise object represents the result of the db update query
*/
exports.update = async function updateCategory (categoryId, category) {
    let query = "UPDATE categories SET ? WHERE ID = ?";
    let values = [category, categoryId];
    let data = await db.run_query(query, values);
    return data;
}

/** Delete a category from the categories table
 * @async
 * @param {integer} id - category id
 * @returns {Promise} - Promise object represents the result of the db delete query
*/
exports.delete = async function deleteCategory (id) {
    let query = "DELETE FROM categories WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}