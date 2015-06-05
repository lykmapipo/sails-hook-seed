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
        // associations
        hasOneGroup: {
            model: 'group'
        },
        // many-to-one 
        hasManyGroups: {
            collection: 'group',
            via: 'hasOneUser'
        },
        // many-to-many
        manyManyGroups: {
            collection: 'group',
            via: 'manyManyUsers'
        }
    }
};