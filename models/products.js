/** This module contains functions for interacting with the products table in the DB
 * @module models/products
 * @requires helpers/database
 * @see routes/products for the routes that use these functions
 */

const db = require('../helpers/database');

/** Update the sold status of a product to true
 * @async
 * @param {integer} id - product id
 * @returns {Promise} - Promise object represents the result of the db update query
 */
exports.updateSold = async function updateSold (id) {
    let query = "UPDATE products SET sold = TRUE WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

/** Get all products or products belonging to a category (sent in the request query)
 * @async
 * @param {integer} page - page number
 * @param {integer} limit - number of products per page
 * @param {string} order - order by column
 * @param {integer} category - category id
 * @returns {Promise} - Promise object represents the products (data)
 */
exports.getAll = async function getAllProducts (page, limit, order, category) {
    // get all rows from the products table
    let query = "SELECT * FROM products";
    let values = [];
    
    if (category) {
        query += " WHERE category_id = ?";
        values.push(category);
    }
    if (order) {
        query += ` ORDER BY ${order}`;
    }
    if (page && limit) {
        query += " LIMIT ? OFFSET ?";
        values.push(limit);
        values.push((page - 1) * limit);
    }
    
    const data = await db.run_query(query, values);
    return data;
}

/** Get a single product by its id
 * @async
 * @param {integer} id - product id
 * @returns {Promise} - Promise object (data) represents the product
 */
exports.getById = async function getById (id) {
    // get all rows from the products table
    let query = "SELECT * FROM products WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

/** Add a new product to the products table
 * @async
 * @param {object} product - New product object
 * @returns {Promise} - Promise object returns the results of the insert query
 */
exports.add = async function addProduct (product) {
    let query = "INSERT INTO products SET ?";
    let data = await db.run_query(query, product);
    return data;
}

/** Update a product in the products table
 * @async
 * @param {integer} ProductId - product id
 * @param {object} product - new product values object
 * @returns {Promise} - Promise object represents the result of the db update query
 */
exports.update = async function updateProduct (ProductId, product) {
    let query = "UPDATE products SET ? WHERE ID = ?";
    let values = [product, ProductId];
    let data = await db.run_query(query, values);
    return data;
}

/** Delete a product from the products table
 * @async
 * @param {integer} id - product id
 * @returns {Promise} - Promise object represents the result of the db delete query
 */
exports.delete = async function deleteProduct (id) {
    let query = "DELETE FROM products WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}
