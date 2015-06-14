sails-hook-seed
====================

[![Build Status](https://travis-ci.org/lykmapipo/sails-hook-seed.svg?branch=master)](https://travis-ci.org/lykmapipo/sails-hook-seed)

[![Tips](https://img.shields.io/gratipay/lykmapipo.svg)](https://gratipay.com/lykmapipo/)

[![Support via Gratipay](https://cdn.rawgit.com/gratipay/gratipay-badge/2.3.0/dist/gratipay.svg)](https://gratipay.com/lykmapipo/)

DRY data seeding for sails.

Simplify seeding data to your persistent storage of your choice based on the current running environment obtained from `sails.config.environment` of your application. That is to say, you may use `sails-hook-seed` during `test`,`development` and even seed your application with default data during deployment in `production` environment.

*Note: This requires Sails v0.11.0+.  If v0.11.0+ isn't published to NPM yet, you'll need to install it via Github.*

## Installation
```js
$ npm install --save sails-hook-seed
```

## Usage
By default `sails-hook-seed` look for environment specific seeds in the `seeds` directory inside `sails.appPath` of your application. Example, if you need to seed your application during `test` you will have to create `seeds/test` and add `model seed files` inside it.

`sails-hook-seed` will load any file suffix-ed with `Seed` and load it as a seed. Example, if you want to seed your `User` model during `test` your need to write your seed as folow:

```js
//in seed/test/UserSeed.js
var faker = require('faker');

//array of plain object
//to seed in User model
module.exports = [{
    username: faker.internet.userName(),
    email: faker.internet.email()
}];
```

## Seed Types
`sails-hook-seed` accept `array type`, `plain object` and `functional` type seeds.

### Examples

#### Object seed type
```js
//in seed/test/UserSeed.js
var faker = require('faker');

//object to seed
//in User model
module.exports = {
    username: faker.internet.userName(),
    email: faker.internet.email()
};
```

#### Array seed type
```js
//in seed/test/UserSeed.js
var faker = require('faker');

//array of data to seed
module.exports = [{
    username: faker.internet.userName(),
    email: faker.internet.email()
}];
```

#### Functional seed type
```js
//in seed/test/UserSeed.js
var faker = require('faker');

//function to be evaluated to obtain data
module.exports = function(done) {

    var data = [{
        username: faker.internet.userName(),
        email: faker.internet.email()
    }, {
        username: faker.internet.userName(),
        email: faker.internet.email()
    }];

    //remember to tell when your are done
    done(null, data);
};
```


The same convection must be followed for `development` and `production` environment.

*Note: Environement specific folder are named after their environment name, e.g if `sails.config.environment` is `test`, then to make sure your test seeds are loaded they must be placed under `seed/test` folder for `sails-hook-seed` to pick and apply your seeds. Your may look this repo `seeds folder` to see example*

## Configuration
`sails-hook-seed` accept application defined configuration by utilizing sails configuration api. In sails `config` directory add `config/seed.js` and you will be able to override all the defauts configurations.

Simply, copy the below and add it to your `config/seed.js`
```js
module.exports.seed = {
    //directory where migration resides
    //relative to `sails.appPath`
    path: 'seeds'
}
```

## Testing

* Clone this repository

* Install `grunt-cli` global

```sh
$ npm install -g grunt-cli
```

* Install all development dependencies

```sh
$ npm install
```

* Then run test

```sh
$ npm test
```

## Contribute

Fork this repo and push in your ideas. 
Do not forget to add a bit of test(s) of what value you adding.

# TODO
- [ ] Removing id from find conditions
- [ ] Allow specifying find attributes
- [ ] Use rails migrations dependencies style to allow seeding for associations

## Licence

Copyright (c) 2015 lykmapipo & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
