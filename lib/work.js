 var _ = require('lodash');
 /**
  * @description prepare work to be performed during seeding the data
  * @param  {Object} seeds environment specific loaded seeds from the seeds directory
  * @return {Array} a collection of works to be performed during data loading
  */
 module.exports = function(seeds) {
     //work to be done
     //in parallel during
     //data seeding
     var work = [];

     //prepare all seeds
     //data for parallel execution
     _.keys(seeds)
         .forEach(function(seed) {
             // deduce model globalId
             var modelGlobalId = seed.split('S')[0].toLowerCase();

             //grab sails model from ins globalId
             //NOTE!: this is save cause other may
             //enable model to be global but others
             //may not
             var Model = sails.models[modelGlobalId];

             //grab data to load
             //from the seed data attribute
             var seedData = seeds[seed];

             //is data just a plain object
             if (_.isPlainObject(seedData)) {
                 //push work to be done
                 work.push(function(next) {
                     //create seed function
                     Model
                         .findOrCreate(seedData, seedData, next);
                 });
             }

             //is array data
             if (_.isArray(seedData)) {
                 _.forEach(seedData, function(data) {
                     //push work to be done
                     work.push(function(next) {
                         //create seed function
                         Model
                             .findOrCreate(data, data, next);
                     });
                 });
             }

             //TODO
             //handle function data type
         });

     return work;
 };