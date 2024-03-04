/**
 * @module permissions/categories
 * @description Configures authorisation rules using the role-acl library, defining roles and their permissions for the category model.
 * @requires role-acl
 * @see routes/categories for the routes that use these functions
 */

const AccessControl = require('role-acl');

// create a new instance of AccessControl
const ac = new AccessControl();

/** User Permissions
 * Grants 'user' fake permissions to readNone categories (no permissions).
 * Allows actions: 'readNone'.
 * Denies actions: 'create', 'update', 'delete'.
 */
ac.grant('user')
    .execute('readNone').on('category');

/** Admin Permissions
 * Grants 'admin' role permissions to manage all categories.
 * Allows actions: 'read', 'create', 'update', 'delete'.
 */
ac.grant('admin')
    .execute('create').on('category')
    .execute('read').on('category')
    .execute('update').on('category')
    .execute('delete').on('category');


/** Checks the users permission to create a new category
 * @function create
 * @param {object} requester - object representing the user making the request
 * @returns {object} - object represents the result of the authorisation check
 */
exports.create = (requester) =>
    ac.can(requester.role).execute('create').sync().on('category');

/** Checks the users permission to read a category/categories
 * @function read
 * @param {object} requester - object representing the user making the request
 * @returns {object} - object represents the result of the authorisation check
 */
exports.read = (requester) =>
ac.can(requester.role).execute('read').sync().on('category');

/** Checks the users permission to update a category
 * @function update
 * @param {object} requester - object representing the user making the request
 * @param {integer} id - id of the owner of the category
 * @returns {object} - object represents the result of the authorisation check
 */
exports.update = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('update').sync().on('category');

/** Checks the users permission to delete a category
 * @function delete
 * @param {object} requester - object representing the user making the request
 * @param {integer} id - id of the owner of the category
 * @returns {object} - object represents the result of the authorisation check
 */
exports.delete = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('delete').sync().on('category');
