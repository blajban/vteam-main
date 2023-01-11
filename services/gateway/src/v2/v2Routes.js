const express = require('express');
const controllers = require('./v2Controllers');

const router = express.Router();

router.route('/version')
  .get(controllers.testVersion);

module.exports = router;
