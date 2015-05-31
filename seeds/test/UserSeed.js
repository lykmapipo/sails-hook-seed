'use strict';

var faker = require('faker');

//function to be evaluated to obtain data
//it may also be an object or array
module.exports = function(done) {

    var data = [{
        id: 1,
        username: faker.internet.userName(),
        email: faker.internet.email()
    }, {
        id: 2,
        username: faker.internet.userName(),
        email: faker.internet.email()
    }];

    done(null, data);
};
