/**
 * sample model
 * @type {Object}
 */
module.exports = {
    attributes: {
        name: {type: 'string'},
        users: {
          collection: 'user',
          via: 'groups',
          dominant: true
        } 
    }
};
