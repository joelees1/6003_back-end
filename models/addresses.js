const db = require('../helpers/database');

//list all the addresses belonging to a user
exports.getAll = async function getAllAddresses (id) {
    let query = "SELECT * FROM addresses WHERE user_id = ?";
    let values = [id];
    
    const data = await db.run_query(query, values);
    return data;
}

//get an address by its id
exports.getById = async function getById (addressId, userId) {
    // get a single address by its id belonging to a user
    let query = "SELECT * FROM addresses WHERE ID = ? AND user_id = ?";
    let values = [addressId, userId];
    let data = await db.run_query(query, values);
    return data;
}

//create a new address
exports.add = async function addAddress (address) {
    let query = "INSERT INTO addresses SET ?";
    let data = await db.run_query(query, address);
    return data;
}

//update an existing address
exports.update = async function updateAddress (addressId, userId, address) {
    // only allow the owner of the address to update it
    let query = "UPDATE addresses SET ? WHERE ID = ? AND user_id = ?";
    let values = [address, addressId, userId];
    let data = await db.run_query(query, values);
    return data;
}

//delete address
exports.delete = async function deleteAddress (addressId, userId) {
    // only allow the owner of the address to delete it
    let query = "DELETE FROM addresses WHERE ID = ? AND user_id = ?";
    let values = [addressId, userId];
    let data = await db.run_query(query, values);
    return data;
}
