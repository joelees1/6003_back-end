const AccessControl = require('role-acl');
const ac = new AccessControl();

// grant user a fake permission (no permissions)
ac.grant('user')
    .execute('readNone').on('category');

// grant admin all permissions
ac.grant('admin')
    .execute('read').on('category')
    .execute('create').on('category') // CRUD all categories
    .execute('update').on('category')
    .execute('delete').on('category');

// readAllCategories
exports.read = (requester) =>
    ac.can(requester.role).execute('read').sync().on('category');

// createCategory
exports.create = (requester) =>
    ac.can(requester.role).execute('create').sync().on('category');

// updateCategory
exports.update = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('update').sync().on('category');

// deleteCategory
exports.delete = (requester, id) =>
    ac.can(requester.role).context({ requester: requester.id, owner: id }).execute('delete').sync().on('category');
