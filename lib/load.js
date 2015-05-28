'use strict';

//dependencies
var path = require('path');
var prepareWork = require(path.join(__dirname, 'work'));

/**
 * @description loading seeting data to configured `model` the persistent storage
 */
module.exports = function(config, done) {
    //guess current sails environment
    var environment = sails.config.environment || 'test';

    //deduce what seed to load
    //based on current environment
    var seedsPath =
        path.join(sails.config.appPath, config.path, environment);

    sails.log.debug('loading seeds from:');
    sails.log.debug(seedsPath);

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

    //if there is  a work to perform
    if (_.size(work) > 0) {
        //now lets do the work
        //in parallel fashion
        async
            .parallel(work, function(error, result) {
                done(error, {
                    environment: environment,
                    data: result
                });
            });

    } else {
        //nothing to perform
        done();
    }
};
