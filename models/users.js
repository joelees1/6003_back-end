const db = require('../helpers/database');

//get a single user by the (unique) username
exports.findByUsername = async function getByUsername(username) {
    const query = "SELECT * FROM users WHERE username = ?";
    const value = [username];
    const user = await db.run_query(query, value);
    return user;
  }  

//list all the articles
exports.getAll = async function getAll (page, limit, order) {
    // get all rows from the users table, without password
    let query = "SELECT id, username, first_name, last_name, email, phone_number, created_at, updated_at FROM users";
    let values = [];

    if (order) {
        query += ` ORDER BY ${order}`;
    }
    if (page && limit) {
        query += " LIMIT ? OFFSET ?";
        values = [limit, (page - 1) * limit];
    }
    
    const data = await db.run_query(query, values);
    return data;
}

//get a single user by its id  
exports.getById = async function getById (id) {
    // get all rows from the users table, without password
    let query = "SELECT id, username, first_name, last_name, email, phone_number, created_at, updated_at FROM users WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

//create a new user
exports.add = async function add (article) {
    let query = "INSERT INTO users SET ?";
    let data = await db.run_query(query, article);
    return data;
}

//update an existing user
exports.update = async function update (id, article) {
    let query = "UPDATE users SET ? WHERE ID = ?";
    let values = [article, id];
    let data = await db.run_query(query, values);
    return data;
}

//delete user
exports.delete = async function deleteArticle (id) {
    let query = "DELETE FROM users WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}
