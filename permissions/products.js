const AccessControl = require('role-acl');
const ac = new AccessControl();

// reading products getAll/byid requires no login
// user permissions
ac.grant('user')
    .execute('read').on('product');

// admin permissions
ac.grant('admin')
    .execute('create').on('product') // CRUD all products
    .execute('update').on('product')
    .execute('delete').on('product');

// createProduct
exports.create = (requester) =>
    ac.can(requester.role).execute('create').sync().on('product');

// updateProduct
exports.update = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('update').sync().on('product');

// deleteProduct
exports.delete = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('delete').sync().on('product');
