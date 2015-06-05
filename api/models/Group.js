/**
 * sample model
 * @type {Object}
 */
module.exports = {
    attributes: {
        name: {type: 'string'},
        // associations
        hasOneUser: {
          model: 'user'
        },
        // many-to-one 
        hasManyUsers: {
          collection: 'user',
          via: 'hasOneGroup',
        }, 
        // many-to-many
        manyManyUsers: {
          collection: 'user',
          via: 'manyManyGroups',
          dominant: true
        } 
    }
};
