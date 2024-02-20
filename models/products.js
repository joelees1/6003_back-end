const db = require('../helpers/database');

// update sold to true
exports.updateSold = async function updateSold (id) {
    let query = "UPDATE products SET sold = TRUE WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

// get all products
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

// get a single product by id
exports.getById = async function getById (id) {
    // get all rows from the products table
    let query = "SELECT * FROM products WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

// create a new product
exports.add = async function addProduct (product) {
    let query = "INSERT INTO products SET ?";
    let data = await db.run_query(query, product);
    return data;
}

// update existing product
exports.update = async function updateProduct (ProductId, product) {
    let query = "UPDATE products SET ? WHERE ID = ?";
    let values = [product, ProductId];
    let data = await db.run_query(query, values);
    return data;
}

// delete product
exports.delete = async function deleteProduct (id) {
    let query = "DELETE FROM products WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}
