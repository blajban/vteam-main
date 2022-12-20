const controllers = require('./controllers.js');

module.exports = (app) => {
  app.route('/eventflows/rent_scooter/:scooterId/:userId')
    .get(controllers.rentScooter);
  app.route('/eventflows/park_scooter/:scooterId')
    .get(controllers.parkScooter);
  app.route('/eventflows/simulate_scooters')
    .get(controllers.simulateScooters); // Todo
  app.route('/eventflows/stop_simulation')
    .get(controllers.stopSimulation); // Todo
  app.route('/eventflows/addRandomScooters/:city/:number')
    .get(controllers.addRandomScooters);
  app.route('/city/:city/scooter')
    .get(controllers.getScooters)
    .post(controllers.addScooter);
  app.route('/city/:city/scooter/:scooterId')
    .get(controllers.getScooters)
    .put(controllers.updateScooter)
    .delete(controllers.removeScooter);
  app.route('/city/:city/parking')
    .get(controllers.getParkingspots)
    .post(controllers.addParkingspot)
    .put(controllers.updateParkingspot)
    .delete(controllers.removeParkingspot)
  app.route('/users')
    .get(controllers.getUsers)
    .post(controllers.addUser);
  app.route('/users/:userId')
    .get(controllers.getUsers)
    .put(controllers.updateUser)
    .delete(controllers.removeUser);
  app.route('/login')
    .get(controllers.login);
  app.route('/getToken/:code')
    .get(controllers.getToken);
  app.route('/getGitHubUser/:token')
    .get(controllers.getGitHubUser);
  app.route('/invoice')
    .post(controllers.addInvoice);
  app.route('/invoice/user/:userId')
    .get(controllers.getInvoices);
  app.route('/invoice/:invoiceId')
    .get(controllers.getInvoices);
  app.route('/rates')
    .get(controllers.getRates)
    .post(controllers.addRate)
    .put(controllers.updateRate)
    .delete(controllers.removeRate);
};

