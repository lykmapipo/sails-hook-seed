# Association seeding

## Givance merge
```sh
Fast-forward
 api/models/Group.js           |  24 +++++
 api/models/User.js            |  16 +++-
 lib/load.js                   |  19 ++--
 lib/work.js                   |  69 +++++++++++++--
 seeds/development/UserSeed.js |   2 +-
 seeds/production/UserSeed.js  |   2 +-
 seeds/test/UserSeed.js        |   2 +-
 test/associations.spec.js     | 198 ++++++++++++++++++++++++++++++++++++++++++
 test/seed.spec.js             |  10 +--
 9 files changed, 319 insertions(+), 23 deletions(-)
 create mode 100644 api/models/Group.js
 create mode 100644 test/associations.spec.js
```

## Associations Dump
 ```javascript
 associations: {
       [ 
        { alias: 'hasOneGroup', 
            type: 'model', 
            model: 'group' },
         { alias: 'hasManyGroups',
           type: 'collection',
           collection: 'group',
           via: 'hasOneUser' },
         { alias: 'manyManyGroups',
           type: 'collection',
           collection: 'group',
           via: 'manyManyUsers' }
        ] 
};
```

## Note
- Seeds are applied in parallel with no order
- Undestand `sails` association implementation 
- Understand sails `via`, `dominant` and other associations terminology
- Make use of `seeds` to drive seeding and not `models` to drive seeding when implementing seeding logics

## Reference Models
We will be using [sailsjs association models](http://sailsjs.org/#!/documentation/concepts/ORM) as reference models to be used in  implementing `association seeding` in `sails-hook-seed`.

## Object Based Implementation

### One Way Associations


### Two Way Associations

### One-to-One



# References
- [Rails FixtureSet](http://api.rubyonrails.org/classes/ActiveRecord/FixtureSet.html)
- [ActiveRecord Fixtures](http://api.rubyonrails.org/v3.2.8/classes/ActiveRecord/Fixtures.html)
- [TestFixtures API](http://api.rubyonrails.org/classes/ActiveRecord/TestFixtures.html)
- [Test Fixture Class Methods](http://api.rubyonrails.org/classes/ActiveRecord/TestFixtures/ClassMethods.html)
- [FixtureSet ClassCache](http://api.rubyonrails.org/classes/ActiveRecord/FixtureSet/ClassCache.html)