const controllers = require('./v1Controllers.js');
const express = require('express')
const router = express.Router()


router.route('/eventflows/rent_scooter/:scooterId/:userId')
  .get(controllers.rentScooter);
router.route('/eventflows/park_scooter/:scooterId')
  .get(controllers.parkScooter);
router.route('/eventflows/simulate_scooters')
  .get(controllers.simulateScooters); // Todo
router.route('/eventflows/stop_simulation')
  .get(controllers.stopSimulation); // Todo
router.route('/eventflows/addRandomScooters/:city/:number')
  .get(controllers.addRandomScooters);
router.route('/city/:city/scooter')
  .get(controllers.getScooters)
  .post(controllers.addScooter);
router.route('/city/:city/scooter/:scooterId')
  .get(controllers.getScooters)
  .put(controllers.updateScooter)
  .delete(controllers.removeScooter);
router.route('/city/:city/parking')
  .get(controllers.getParkingspots)
  .post(controllers.addParkingspot)
  .put(controllers.updateParkingspot)
  .delete(controllers.removeParkingspot)
router.route('/users')
  .get(controllers.getUsers)
  .post(controllers.addUser);
router.route('/users/:userId')
  .get(controllers.getUsers)
  .put(controllers.updateUser)
  .delete(controllers.removeUser);
router.route('/login')
  .get(controllers.login);
router.route('/getToken/:code')
  .get(controllers.getToken);
router.route('/getGitHubUser/:token')
  .get(controllers.getGitHubUser);
router.route('/invoice')
  .post(controllers.addInvoice);
router.route('/invoice/user/:userId')
  .get(controllers.getInvoices);
router.route('/invoice/:invoiceId')
  .get(controllers.getInvoices);
router.route('/rates')
  .get(controllers.getRates)
  .post(controllers.addRate)
  .put(controllers.updateRate)
  .delete(controllers.removeRate);

module.exports = router;