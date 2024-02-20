const db = require('../helpers/database');

// get all orders
exports.getAll = async function getAllOrders (userId) {
    // get all rows from the orders table
    let query = "SELECT * FROM orders";
    let values = [];

    if (userId) {
        query += " WHERE user_id = ?";
        values = [userId];
    }

    const data = await db.run_query(query, values);
    return data;
}

// create a new order
exports.add = async function addOrder (order) {
    let query = "INSERT INTO orders SET ?";
    let data = await db.run_query(query, order);
    return data;
}

// get a single order
exports.getById = async function getOrderById (id) {
    let query = "SELECT * FROM orders WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

// update existing order
exports.update = async function updateOrder (orderId, order) {
    let query = "UPDATE orders SET ? WHERE ID = ?";
    let values = [order, orderId];
    let data = await db.run_query(query, values);
    return data;
}

// delete order
exports.delete = async function deleteOrder (id) {
    let query = "DELETE FROM orders WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}