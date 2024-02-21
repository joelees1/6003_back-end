/**
 * @module permissions/orders
 * @description Configures authorisation rules using the role-acl library, defining roles and their permissions for the order model.
 * @requires role-acl
 * @see routes/orders for the routes that use these functions
 */

const AccessControl = require('role-acl');

// create a new instance of AccessControl
const ac = new AccessControl();

/** User Permissions
 * Grants 'user' role permissions to post and read their orders.
 * Allows actions: 'create', 'read'.
 * Denies actions: 'update', 'delete'.
 */
ac.grant('user')
    .execute('create').on('order')
    .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }) // if requester is the owner allow read
    .execute('read').on('order')

/** Admin Permissions
 * Grants 'admin' role permissions to manage all orders.
 * Allows actions: 'create', 'read', 'update', 'delete'.
 */
ac.grant('admin')
    .execute('create').on('order')
    .execute('read').on('order')
    .execute('update').on('order')
    .execute('delete').on('order');

/** Checks the users permission to create a new order
 * @function create
 * @param {object} requester - object representing the user making the request
 * @returns {object} - object represents the result of the authorisation check
 */
exports.create = (requester) =>
    ac.can(requester.role).execute('create').sync().on('order');

/** Checks the users permission to read an order/orders
 * @function read
 * @param {object} requester - object representing the user making the request
 * @param {integer} id - id of the owner of the order
 * @returns {object} - object represents the result of the authorisation check
 */
exports.read = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('read').sync().on('order');

/** Checks the users permission to update an order
 * @function update
 * @param {object} requester - object representing the user making the request
 * @param {integer} id - id of the owner of the order
 * @returns {object} - object represents the result of the authorisation check
 */
exports.update = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('update').sync().on('order');

/** Checks the users permission to delete an order
 * @function delete
 * @param {object} requester - object representing the user making the request
 * @param {integer} id - id of the owner of the order
 * @returns {object} - object represents the result of the authorisation check
 */
exports.delete = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('delete').sync().on('order');