/**
 * sample model
 * @type {Object}
 */
module.exports = {
    attributes: {
        username: {
            type: 'string'
        },
        email: {
            type: 'email'
        },
        groups: {
            collection: 'group',
            via: 'users'
        }
    }
};
