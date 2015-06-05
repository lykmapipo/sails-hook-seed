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

    //deduce what seed to load
    //based on current environment
    var seedsPath =
        path.join(sails.config.appPath, config.path, environment);

    //log seed environment
    sails.log.debug('seeding %s data', environment);

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
        //now lets do the work
        //in parallel fashion
        async.parallel(work, function(error, associationsWork) {
            // flatten lists
            associationsWork = [].concat.apply([], associationsWork);

            if (associationsWork.length) {
                sails.log.debug('load associations');
            }

            async.parallel(associationsWork, function(error, results) {
                done(error, {
                    environment: environment,
                    data: results
                });
            });
        });
    } else {
        //nothing to perform
        done();
    }
};