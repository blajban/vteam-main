const express = require('express');
const controllers = require('./v1Controllers');

const router = express.Router();

router.route('/eventflows/rent_scooter/:scooterId/:userId/:loginId')
  .get(controllers.rentScooter);
router.route('/eventflows/park_scooter/:scooterId/:loginId')
  .get(controllers.parkScooter);
router.route('/eventflows/simulate_scooters/:loginId')
  .get(controllers.simulateScooters);
router.route('/eventflows/stop_simulation/:loginId')
  .get(controllers.stopSimulation);
router.route('/eventflows/addRandomScooters/:city/:number/:loginId')
  .get(controllers.addRandomScooters);
router.route('/city/:city/scooter')
  .get(controllers.getScooters);
router.route('/city/:city/scooter/:loginId')
  .post(controllers.addScooter);
router.route('/city/:city/scooter/:scooterId')
  .get(controllers.getScooters);
router.route('/city/:city/scooter/:scooterId/:loginId')
  .put(controllers.updateScooter)
  .delete(controllers.removeScooter);
router.route('/city/:city/parking')
  .get(controllers.getParkingspots);
router.route('/city/:city/parking/:loginId')
  .post(controllers.addParkingspot)
  .put(controllers.updateParkingspot)
  .delete(controllers.removeParkingspot);
router.route('/users/:loginId')
  .get(controllers.getUsers)
  .post(controllers.addUser);
router.route('/users/:loginId/:userId')
  .get(controllers.getUsers)
  .put(controllers.updateUser)
  .delete(controllers.removeUser);
router.route('/getToken/:code')
  .get(controllers.getToken);
router.route('/getWebToken/:code')
  .get(controllers.getWebToken);
router.route('/getGitHubUser')
  .get(controllers.getGitHubUser);
router.route('/invoice/:loginId')
  .post(controllers.addInvoice);
router.route('/invoice/:loginId/pay/:invoiceId')
  .put(controllers.payInvoice);
router.route('/invoice/:loginId/user/:userId')
  .get(controllers.getInvoices);
router.route('/invoice/:loginId/:invoiceId')
  .get(controllers.getInvoices);
router.route('/rates')
  .get(controllers.getRates);
router.route('/rates/:loginId')
  .post(controllers.addRate)
  .put(controllers.updateRate)
  .delete(controllers.removeRate);

module.exports = router;
