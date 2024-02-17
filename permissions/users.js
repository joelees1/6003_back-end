const AccessControl = require('role-acl');
const ac = new AccessControl();

// user permissions
ac.grant('user').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
    .execute('read').on('user', ['*', '!password']) // read own user, exclude password
    .execute('update').on('user', ['username', 'first_name', 'last_name', 'email', 'password', 'phone_number']); // update own user

// admin permissions
ac.grant('admin')
    .execute('read').on('user')
    .execute('read').on('users') // read all users
    .execute('update').on('user') // update any user
    .condition({ Fn: 'NOT_EQUALS', args: { 'requester': '$.owner' } }).execute('delete').on('user'); // delete any user but themself


// getAll
exports.readAll = (requester) =>
    ac.can(requester.role).execute('read').sync().on('users');

// getById
exports.read = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('read').sync().on('user');

// updateUser
exports.update = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('update').sync().on('user');

// deleteUser
exports.delete = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('delete').sync().on('user');
