'use strict';

//dependencies
var path = require('path');
var prepareWork = require(path.join(__dirname, 'work'));


/**
 * @function
 * @description loading seed's data into configured model persistent storage
 * @param {Object} config  seed hook configurations
 * @param {Function} done  a callback to invoke on after seeding
 */
module.exports = function(config, done) {
    //guess current sails environment
    var environment = sails.config.environment || 'test';

    //deduce seeds path to use
    //based on current environment
    var seedsPath =
        path.join(sails.config.appPath, config.path, environment);

    //log seed environment
    sails.log.debug('start seeding %s data', environment);

    //log seed location
    sails.log.debug('seeding from %s', seedsPath);

    //load all seeds available
    //in   `seedsPath`
    var seeds = require('include-all')({
        dirname: seedsPath,
        filter: /(.+Seed)\.js$/,
        excludeDirs: /^\.(git|svn)$/,
        optional: true
    });

    //prepare seeding work to perfom
    var work = prepareWork(seeds);

    //if there is a work to perform
    if (_.size(work) > 0) {

        async
            .waterfall([
                    function seedModels(next) {
                        //now lets do the work
                        //in parallel fashion
                        async.parallel(work, next);
                    },
                    function seedAssociations(associationsWork, next) {
                        // flatten lists
                        associationsWork = [].concat.apply([], associationsWork);

                        if (_.size(associationsWork) > 0) {

                            //seed associations if available
                            sails.log.debug('load associations');

                            //TODO what results to log?
                            async.parallel(associationsWork, next);
                        } else {
                            next();
                        }
                    }
                ],
                function(error, results) {
                    //signal seeding complete
                    sails.log.debug('complete seeding %s data', environment);

                    done(error, {
                        environment: environment,
                        data: results
                    });
                });
    }
    //nothing to perform back-off
    else {
        done();
    }
};