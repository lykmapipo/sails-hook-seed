'use strict';

var faker = require('faker');

//array of data to seed
//it may also be an object
module.exports = [{
    username: faker.internet.userName(),
    email: faker.internet.email()
}];