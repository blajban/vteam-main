const controllers = require('./v2Controllers.js');
const express = require('express')
const router = express.Router()


router.route('/version')
  .get(controllers.testVersion);

module.exports = router;
