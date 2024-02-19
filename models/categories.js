const db = require('../helpers/database');

// get all categories
exports.getAll = async function getAllCategories () {
    // get all rows from the categories table
    let query = "SELECT * FROM categories";
    const data = await db.run_query(query);
    return data;
}

// create a new category
exports.add = async function addCategory (category) {
    let query = "INSERT INTO categories SET ?";
    let data = await db.run_query(query, category);
    return data;
}

// get a single category
exports.getById = async function getCategoryById (id) {
    let query = "SELECT * FROM categories WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

// update existing category
exports.update = async function updateCategory (categoryId, category) {
    let query = "UPDATE categories SET ? WHERE ID = ?";
    let values = [category, categoryId];
    let data = await db.run_query(query, values);
    return data;
}

// delete category
exports.delete = async function deleteCategory (id) {
    let query = "DELETE FROM categories WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}