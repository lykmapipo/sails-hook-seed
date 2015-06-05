'use strict';

//dependencies
var expect = require('chai').expect;
var path = require('path');

var prepareWork = require(path.join(__dirname, '..', 'lib', 'work'));

describe('Hook#seed associations', function() {

    beforeEach('clean up seeds', function(done) {
        sails.models.user.destroy(1, function() {
            sails.models.group.destroy(1, done);
        });
    });


    it('should be able to associate one-to-one', function(done) {
        var seeds = {
            UserSeed: {
                id: 1,
                username: 'user one-to-one',
                hasOneGroup: 1
            },
            GroupSeed: {
                id: 1,
                name: 'group one-to-one',
                hasOneUser: 1
            }
        };

        var work = prepareWork(seeds);

        async.parallel(work, function(error, associationsWork) {
            if (error) {
                done(error);
            } else {
                associationsWork = [].concat.apply([], associationsWork);
                // verify associations work list
                expect(associationsWork).to.be.a('array');
                expect(associationsWork.length).to.be.equal(0);

                // verify the association
                sails.models.group
                    .findOne(1)
                    .populate('hasOneUser')
                    .exec(function(err, group) {
                        if (err) {
                            return done(err);
                        }

                        expect(group.hasOneUser.username)
                            .to.be.equal('user one-to-one');

                        sails.models.user
                            .findOne(1)
                            .populate('hasOneGroup')
                            .exec(function(err, user) {
                                if (err) {
                                    return done(err);
                                }

                                expect(user.hasOneGroup.name)
                                    .to.be.equal('group one-to-one');

                                sails.models.group.destroy(1);
                                sails.models.user.destroy(1, done);
                            });
                    });
            }
        });
    });

    
    it('should be able to associate many-to-one', function(done) {
        var seeds = {
            UserSeed: {
                id: 1
            },
            GroupSeed: {
                name: 'group many-to-one',
                hasManyUsers: [1]
            }
        };

        var work = prepareWork(seeds);

        async.parallel(work, function(error, associationsWork) {
            if (error) {
                done(error);
            } else {
                associationsWork = [].concat.apply([], associationsWork);
                // verify associations work list
                expect(associationsWork).to.be.a('array');
                expect(associationsWork.length).to.be.equal(1);

                var associationWork = associationsWork[0];
                expect(associationWork).to.be.a('function');

                // execute work and apply the Group association
                associationWork(function(err, record) {
                    if (err) {
                        return done(err);
                    }
                    var expectedGroupName = 'group many-to-one';
                    expect(record.name).to.be.equal(expectedGroupName);
                    expect(record.hasManyUsers.length).to.be.equal(1);

                    // verify the association from the User
                    sails.models.user
                        .findOne(1)
                        .populate('hasOneGroup')
                        .exec(function(err, user) {
                            if (err) {
                                return done(err);
                            }

                            expect(user.hasOneGroup.name)
                                .to.be.equal(expectedGroupName);

                            done();
                        });
                });
            }
        });
    });

    
    it('should be able to associate many-to-many', function(done) {
        var seeds = {
            UserSeed: {
                id: 1
            },
            GroupSeed: {
                name: 'group many-to-many',
                manyManyUsers: [1]
            }
        };

        var work = prepareWork(seeds);

        async.parallel(work, function(error, associationsWork) {
            if (error) {
                done(error);
            } else {
                associationsWork = [].concat.apply([], associationsWork);
                // verify associations work list
                expect(associationsWork).to.be.a('array');
                expect(associationsWork.length).to.be.equal(1);

                var associationWork = associationsWork[0];
                expect(associationWork).to.be.a('function');

                // execute work and apply the Group association
                associationWork(function(err, record) {
                    if (err) {
                        return done(err);
                    }
                    var expectedGroupName = 'group many-to-many';
                    expect(record.name).to.be.equal(expectedGroupName);
                    expect(record.manyManyUsers.length).to.be.equal(1);

                    // verify the association from the User
                    sails.models.user
                        .findOne(1)
                        .populate('manyManyGroups')
                        .exec(function(err, user) {
                            if (err) {
                                return done(err);
                            }

                            var groups = user.manyManyGroups;
                            expect(groups.length).to.be.equal(1);
                            var group = groups[0];
                            expect(group.name).to.be.equal(expectedGroupName);

                            done();
                        });
                });
            }
        });
    });

    
    it('should throw an error of type insert', function(done) {
        var seeds = {
            GroupSeed: {
                name: 'group one',
                manyManyUsers: [999]
            }
        };

        var work = prepareWork(seeds)[0];

        work(function(error, associationsWork) {
            if (error) {
                done(error);
            } else {
                var associationWork = associationsWork[0];
                expect(associationWork).to.be.a('function');

                // execute work and apply the Group association
                associationWork(function(err, record) {
                    err = err[0];
                    expect(err.type).to.be.equal('insert');
                    var expected = 'group_manymanyusers__user_manymanygroups';
                    expect(err.collection).to.be.equal(expected);
                    done(null, record);
                });
            }
        });
    });

});