const db = require('../helpers/database');

// get a single user by the (unique) username
// used by login
exports.findByUsername = async function getByUsername (username) {
    const query = "SELECT * FROM users WHERE username = ?";
    const value = [username];
    const user = await db.run_query(query, value);
    return user;
  }  

// get all users
exports.getAll = async function getAllUsers (page, limit, order) {
    // get all rows from the users table, without password
    let query = "SELECT * FROM users";
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

// get a single user by its id  
exports.getById = async function getById (id) {
    // get all rows from the users table, filtered by role in routes
    let query = "SELECT * FROM users WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

// create a new user
exports.add = async function addUser (user) {
    let query = "INSERT INTO users SET ?";
    let data = await db.run_query(query, user);
    return data;
}

// update an existing user
exports.update = async function updateUser (id, user) {
    let query = "UPDATE users SET ? WHERE ID = ?";
    let values = [user, id];
    let data = await db.run_query(query, values);
    return data;
}

// delete user
exports.delete = async function deleteUser (id) {
    let query = "DELETE FROM users WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}
