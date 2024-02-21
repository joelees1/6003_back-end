/**
 * @module permissions/addresses
 * @description Configures authorisation rules using the role-acl library, defining roles and their permissions for the address model.
 * @requires role-acl
 * @see routes/addresses for the routes that use these functions
 */

const AccessControl = require('role-acl');

// create a new instance of AccessControl
const ac = new AccessControl();

/** User Permissions
 * Grants 'user' role permissions to manage their own address.
 * Allows actions: 'create', 'read', 'update', 'delete'.
 */
ac.grant('user').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
    .execute('create').on('address') // CRUD own addresses
    .execute('read').on('address')
    .execute('update').on('address')
    .execute('delete').on('address');

/** Admin Permissions
 * Grants 'admin' role permissions to manage all addresses.
 * Allows actions: 'create', 'read', 'update', 'delete'.
 */
ac.grant('admin')
    .execute('create').on('address') // CRUD all addresses
    .execute('read').on('address')
    .execute('update').on('address')
    .execute('delete').on('address');


/** Checks the users permission to create a new address
 * @function create
 * @param {object} requester - object representing the user making the request
 * @param {integer} id - id of the owner of the address
 * @returns {object} - object represents the result of the authorisation check
 */
exports.create = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('create').sync().on('address');

/** Checks the users permission to read an address/addresses
 * @function read
 * @param {object} requester - object representing the user making the request
 * @param {integer} id - id of the owner of the address
 * @returns {object} - object represents the result of the authorisation check
 */
exports.read = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('read').sync().on('address');

/** Checks the users permission to update an address
 * @function update
 * @param {object} requester - object representing the user making the request
 * @param {integer} id - id of the owner of the address
 * @returns {object} - object represents the result of the authorisation check
 */
exports.update = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('update').sync().on('address');

/** Checks the users permission to delete an address
 * @function delete
 * @param {object} requester - object representing the user making the request
 * @param {integer} id - id of the owner of the address
 * @returns {object} - object represents the result of the authorisation check
 */
exports.delete = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('delete').sync().on('address');
