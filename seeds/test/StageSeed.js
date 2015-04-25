'use strict';

var faker = require('faker');

//function to be evaluated to obtain data
//it may also be an object or array
module.exports = function(done) {

    var data = [{
        name: faker.internet.userName(),
    }, {
        name: faker.internet.userName(),
    }];

    done(null, data);
};