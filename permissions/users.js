/**
 * @module permissions/users
 * @description Configures authorisation rules using the role-acl library, defining roles and their permissions for the user model.
 * @requires role-acl
 * @see routes/users for the routes that use these functions
 */

const AccessControl = require('role-acl');

// create a new instance of AccessControl
const ac = new AccessControl();

/** User Permissions
 * Grants 'user' role permissions to read and update their user information.
 * Allows actions: 'read', 'update'.
 * Denies actions: 'delete'.
 * Excludes password and role from read.
 * Only allows update of certain fields.
*/
ac.grant('user')
    .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
    .execute('read').on('user', ['*', '!password', '!role'])
    .execute('update').on('user', ['username', 'first_name', 'last_name', 'email', 'password', 'phone_number']);

/** Admin Permissions
 * Grants 'admin' role permissions to manage all users.
 * Allows actions: 'read', 'update', 'delete'.
 * Doesn't allow admin to delete themselves.
*/
ac.grant('admin')
    .execute('read').on('user', ['*', '!password'])
    .execute('read').on('users')
    .execute('update').on('user')
    .condition({ Fn: 'NOT_EQUALS', args: { 'requester': '$.owner' } }).execute('delete').on('user'); // delete any user but themself


/** Checks the users permission to read all user information
 * @function readAll
 * @param {object} requester - object representing the user making the request
 * @returns {object} - object represents the result of the authorisation check
 */
exports.readAll = (requester) =>
    ac.can(requester.role).execute('read').sync().on('users');

/** Checks the users permission to read a single user information
 * @function read
 * @param {object} requester - object representing the user making the request
 * @param {integer} id - id of the user to read
 * @returns {object} - object represents the result of the authorisation check
*/
exports.read = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('read').sync().on('user');

/** Checks the users permission to update a user information
 * @function update
 * @param {object} requester - object representing the user making the request
 * @param {integer} id - id of the user to update
 * @returns {object} - object represents the result of the authorisation check
 */
exports.update = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('update').sync().on('user');

/** Checks the users permission to delete a user
 * @function delete
 * @param {object} requester - object representing the user making the request
 * @param {integer} id - id of the user to delete
 * @returns {object} - object represents the result of the authorisation check
 */
exports.delete = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('delete').sync().on('user');
