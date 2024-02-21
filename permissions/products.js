/**
 * @module permissions/products
 * @description Configures authorisation rules using the role-acl library, defining roles and their permissions for the product model.
 * @requires role-acl
 * @see routes/products for the routes that use these functions
 */

const AccessControl = require('role-acl');

// create a new instance of AccessControl
const ac = new AccessControl();

/** User Permissions
 * Grants 'user' role permissions to read products, read actually requires no auth so uneccesary.
 * Allows actions: 'read'.
 * Denies actions: 'create', 'update', 'delete'.
 */
ac.grant('user')
    .execute('read').on('product');

/** Admin Permissions
 * Grants 'admin' role permissions to manage all products.
 * Allows actions: 'create', 'update', 'delete'.
 */
ac.grant('admin')
    .execute('create').on('product') // CRUD all products
    .execute('update').on('product')
    .execute('delete').on('product');

/** Checks the users permission to create a new product
 * @function create
 * @param {object} requester - object representing the user making the request
 * @returns {object} - object represents the result of the authorisation check
 */
exports.create = (requester) =>
    ac.can(requester.role).execute('create').sync().on('product');

/** Checks the users permission to read a product/products
 * @function read
 * @param {object} requester - object representing the user making the request
 * @returns {object} - object represents the result of the authorisation check
 */
exports.update = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('update').sync().on('product');

/** Checks the users permission to delete a product
 * @function delete
 * @param {object} requester - object representing the user making the request
 * @param {integer} id - id of the owner of the product
 * @returns {object} - object represents the result of the authorisation check
 */
exports.delete = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('delete').sync().on('product');
