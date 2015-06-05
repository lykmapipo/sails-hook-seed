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
