const AccessControl = require('role-acl');
const ac = new AccessControl();

// user permissions
ac.grant('user').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
    .execute('create').on('address') // CRUD own addresses
    .execute('read').on('address')
    .execute('update').on('address')
    .execute('delete').on('address');

// admin permissions
ac.grant('admin')
    .execute('create').on('address') // CRUD all addresses
    .execute('read').on('address')
    .execute('update').on('address')
    .execute('delete').on('address');


// createAddress
exports.create = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('create').sync().on('address');

// getAll & getById
exports.read = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('read').sync().on('address');

// updateAddress
exports.update = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('update').sync().on('address');

// deleteAddress
exports.delete = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('delete').sync().on('address');
