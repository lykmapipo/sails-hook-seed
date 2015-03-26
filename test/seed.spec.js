//dependencies
var expect = require('chai').expect;
var faker = require('faker');
var path = require('path');

var prepareWork = require(path.join(__dirname, '..', 'lib', 'work'));
var loadSeeds = require(path.join(__dirname, '..', 'lib', 'load'));

describe('Hook#seed', function() {

    it('should be loaded as installable hook', function(done) {
        expect(sails.hooks.seed).to.not.be.null;
        done();
    });


    it('should load persistent storage with the provided seeds', function(done) {
        User
            .count(function(error, count) {
                if (error) {
                    done(error);
                } else {
                    expect(count).to.be.above(0);
                    done();
                }
            });
    });


    it('should be able to prepare work(s) to be performed from `array` seeds type', function(done) {
        var seeds = {
            UserSeed: [{
                username: faker.internet.userName(),
                email: faker.internet.email()
            }, {
                username: faker.internet.userName(),
                email: faker.internet.email()
            }]
        };

        var works = prepareWork(seeds);

        expect(works).to.be.a('array');
        expect(works.length).to.be.equal(2);

        var work = works[0];

        expect(work).to.be.a('function');

        //note!
        //since a work its just a wrapper for 
        //Model.findOrCreate
        //lets be sure its doing
        //what it supposed to do
        work(function(error, user) {
            if (error) {
                done(error);
            } else {
                expect(user.id).to.not.be.null;
                expect(user.username).to.not.be.null;
                expect(user.email).to.not.be.null;
                done()
            }
        });
    });


    it('should be able to prepare work to be performed from `object` seed type', function(done) {
        var seeds = {
            UserSeed: {
                username: faker.internet.userName(),
                email: faker.internet.email()
            }
        };

        var works = prepareWork(seeds);

        expect(works).to.be.a('array');
        expect(works.length).to.be.equal(1);

        var work = works[0];

        expect(work).to.be.a('function');

        //note!
        //since a work its just a wrapper for 
        //Model.findOrCreate
        //lets be sure its doing
        //what it supposed to do
        work(function(error, user) {
            if (error) {
                done(error);
            } else {
                expect(user.id).to.not.be.null;
                expect(user.username).to.not.be.null;
                expect(user.email).to.not.be.null;
                done()
            }
        });
    });

    it('should be able to prepare work(s) to be performed from `function` seeds type', function(done) {
        var seeds = {
            UserSeed: function(done) {

                var data = [{
                    username: faker.internet.userName(),
                    email: faker.internet.email()
                }, {
                    username: faker.internet.userName(),
                    email: faker.internet.email()
                }];

                done(null, data);
            }
        };

        var works = prepareWork(seeds);

        expect(works).to.be.a('array');
        expect(works.length).to.be.equal(2);

        var work = works[0];

        expect(work).to.be.a('function');

        //note!
        //since a work its just a wrapper for 
        //Model.findOrCreate
        //lets be sure its doing
        //what it supposed to do
        work(function(error, user) {
            if (error) {
                done(error);
            } else {
                expect(user.id).to.not.be.null;
                expect(user.username).to.not.be.null;
                expect(user.email).to.not.be.null;
                done()
            }
        });
    });


    it('should be able to load test environment specific seeds', function(done) {
        sails.config.environment = 'test';

        loadSeeds(function(error, result) {
            if (error) {
                done(error);
            } else {
                expect(result.environment).to.equal('test');
                expect(result.data).to.not.be.null;
                done();
            }
        });

    });


    it('should be able to load development environment specific seeds', function(done) {
        sails.config.environment = 'development';

        loadSeeds(function(error, result) {
            if (error) {
                done(error);
            } else {
                expect(result.environment).to.equal('development');
                expect(result.data).to.not.be.null;
                done();
            }
        });
    });


    it('should be able to load production environment specific seeds', function(done) {
        sails.config.environment = 'production';

        loadSeeds(function(error, result) {
            if (error) {
                done(error);
            } else {
                expect(result.environment).to.equal('production');
                expect(result.data).to.not.be.null;
                done();
            }
        });
    });


});