'use strict';


/**
 * @function
 * @description log seed activities
 * @param  {Object} model valid sails model
 * @param  {Object} data  data to seed into model
 */
function log(model, data) {
    //TODO handle log level configurations
    //TODO check if logging is allowed in current environment

    //convert seed data into string
    var seedAsString = JSON.stringify(data);

    //if convertion is success
    if (seedAsString) {
        var ellipsis = '...';

        //deduce maximum logging message length
        var debugLength = 50 - ellipsis.length;

        //if seed string length is greater than
        //maximum allowed seed log message
        //reduce seed string to the maximum allowed
        //log message length
        if (seedAsString.length > debugLength) {
            seedAsString = seedAsString.substring(0, debugLength) + ellipsis;
        }
    }

    //TODO use provided log level from configuration
    sails.log.debug(model.adapter.identity + ' ' + seedAsString);
}


/**
 * @function
 * @description apply model associations 
 * @param  {String} modelIdentity model name
 * @param  {Object} record        stored record 
 * @param  {Object} association   association meta data and data  
 * @param  {Function} next        callback 
 */
function applyAssociation(modelIdentity, record, association, next) {
    var msg = modelIdentity + ' { id: ' + record.id + ', ' +
        association.alias + ': ' +
        association.idsList + ' }';

    sails.log.debug(msg);

    record[association.alias].add(association.idsList);

    record.save(next);
}


/**
 * @function
 * @description find or create model 
 * @param  {Object} model      valid sails model
 * @param  {Object} data data seed
 * @param  {Function} next     callback to be invoked on success or error 
 */
function findOrCreate(model, dataObject, next) {
    // prepare pendingAssociations list
    var pendingAssociations = [];

    //visit all model association and prepare
    //migrations work
    for (var i = 0; i < model.associations.length; i++) {
        var association = model.associations[i];

        //TODO what about `model` associations
        if (association.type !== 'collection') {
            continue;
        }

        if (!dataObject[association.alias]) {
            continue;
        }

        association = {
            alias: model.associations[i].alias,
            idsList: dataObject[association.alias]
        };

        // remove association ids from the seed object
        delete dataObject[association.alias];

        pendingAssociations.push(association);
    }

    model.findOrCreate(dataObject, dataObject, function(error, record) {
        //TODO do we log before performing an action or after performing it
        //TODO what this log inform?
        log(model, dataObject);

        if (error) {
            sails.log.error(error.message);
            return next(error);
        }

        var modelIdentity = model.adapter.identity;
        var associationsWork = [];
        pendingAssociations.forEach(function(association) {
            var work = function(next) {
                applyAssociation(modelIdentity, record, association, next);
            };
            associationsWork.push(work);
        });

        //TODO what about created record?
        //is there no need to return it
        next(null, associationsWork);
    });
}


/**
 * @function
 * @description prepare work to be performed during seeding the data
 * @param  {Object} seeds environment specific loaded seeds from the seeds directory
 * @return {Array} a collection of works to be performed during data loading
 */
exports = module.exports = function(seeds) {
    //work to be done
    //in parallel during
    //data seeding
    var work = [];

    //prepare all seeds
    //data for parallel execution
    _.keys(seeds)
        .forEach(function(seed) {
            // deduce model globalId
            var modelGlobalId = seed.replace(/Seed$/, '').toLowerCase();

            //grab sails model from its globalId
            //NOTE!: this is safe cause other may
            //enable model to be global but others
            //may not
            var Model = sails.models[modelGlobalId];

            //grab data to load
            //from the seed data attribute
            var seedData = seeds[seed];

            //prepare work from seed data
            exports.prepare(work, Model, seedData);

        });

    return work;
};


/**
 * @description Take seed data and check if it is of array or object type
 *              and prepare work to be performed from it
 * @param  {Array} work     A collection of database queries to be
 *                          performed to seed data into database
 * @param  {Object} model   A valid sails model
 * @param  {Object|Array|Function} seedData An array or object contains 
 *                                          data or a function to be evaluated
 *                                          to obtain data to seeded into database
 */
exports.prepare = function(work, model, seedData) {
    //is data just a plain object
    if (_.isPlainObject(seedData)) {
        //push work to be done
        work.push(function(next) {
            //create seed function
            findOrCreate(model, seedData, next);
        });
    }

    //is array data
    if (_.isArray(seedData)) {
        _.forEach(seedData, function(data) {
            //push work to be done
            work.push(function(next) {
                //create seed function
                findOrCreate(model, data, next);
            });
        });
    }

    //is functional data
    if (_.isFunction(seedData)) {
        //evaluate function to obtain data
        seedData(function(error, data) {
            //current log error and continue
            //
            //TODO should we throw?
            if (error) {
                sails.log.error(error);
            }

            //invoke prepare with data
            else {
                exports.prepare(work, model, data);
            }
        });
    }
};