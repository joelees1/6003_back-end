const AccessControl = require('role-acl');
const ac = new AccessControl();

// grant user create
ac.grant('user')
    .execute('create').on('order')
    .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('read').on('order')

// grant admin all permissions
ac.grant('admin')
    .execute('create').on('order')
    .execute('read').on('order')
    .execute('update').on('order')
    .execute('delete').on('order');

// createOrder
exports.create = (requester) =>
    ac.can(requester.role).execute('create').sync().on('order');

// readOrder
exports.read = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('read').sync().on('order');

// updateOrder
exports.update = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('update').sync().on('order');

// deleteOrder
exports.delete = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('delete').sync().on('order');