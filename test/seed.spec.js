'use strict';

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
                done();
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
                done();
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
                done();
            }
        });
    });

    it('should be able to apply associations', function(done) {
        var seeds = {
            GroupSeed: {
                name: 'group one',
                users: [1]
            }
        };

        var work = prepareWork(seeds)[0];

        work(function(error, associationsWork) {
            if (error) {
                done(error);
            } else {
                // verify associations work list
                expect(associationsWork).to.be.a('array');
                expect(associationsWork.length).to.be.equal(1);

                var associationWork = associationsWork[0];
                expect(associationWork).to.be.a('function');

                // execute work and apply the Group association
                associationWork(function(err, record) {
                    if (err) { return done(err); }
                    expect(record.name).to.be.equal('group one');
                    expect(record.users.length).to.be.equal(1);

                    // verify the association from the User
                    sails.models.user
                      .findOne(1)
                      .populate('groups')
                      .exec(function(err, user) {
                         if (err) { return done(err); }

                         expect(user.groups.length).to.be.equal(1);
                         expect(user.groups[0].name).to.be.equal('group one');

                         done();
                      });
                });
            }
        });
    });

    it('should be able to prepare work(s) to be performed from seeds start with `S` letter', function(done) {
        var seeds = {
            StageSeed: function(done) {

                var data = [{
                    name: faker.internet.userName(),
                }, {
                    name: faker.internet.userName(),
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
        work(function(error, stage) {
            if (error) {
                done(error);
            } else {
                expect(stage.id).to.not.be.null;
                expect(stage.name).to.not.be.null;
                done();
            }
        });
    });


    it('should be able to load test environment specific seeds', function(done) {
        sails.config.environment = 'test';
        var config = {
            path: 'seeds'
        };

        loadSeeds(config, function(error, result) {
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
        var config = {
            path: 'seeds'
        };

        loadSeeds(config, function(error, result) {
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
        var config = {
            path: 'seeds'
        };

        loadSeeds(config, function(error, result) {
            if (error) {
                done(error);
            } else {
                expect(result.environment).to.equal('production');
                expect(result.data).to.not.be.null;
                done();
            }
        });
    });


    it('should be able to load seeds from custom path', function(done) {
        sails.config.environment = 'test';
        var config = {
            path: 'fixtures'
        };

        loadSeeds(config, function(error, result) {
            if (error) {
                done(error);
            } else {
                expect(result.environment).to.equal('test');
                expect(result.data).to.not.be.null;
                done();
            }
        });
    });

});
