const controllers = require('./controllers.js');

module.exports = (app) => {
  app.route('/city/:city/scooter')
    .get(controllers.getScooters)
    .post(controllers.addScooter);
  app.route('/city/:city/scooter/:scooterId')
    .get(controllers.getScooters)
    .put(controllers.updateScooter)
    .delete(controllers.removeScooter);
    app.route('/city/:city/parking')
    .get(controllers.getParkingspots)
    .post(controllers.addParkingspot); // Docs / Service
  app.route('/city/:city/charging')
    .get(controllers.getChargingStations); // Docs / service
  app.route('/users')
    .get(controllers.getUsers) // Docs / service
    .post(controllers.addUser); // Docs / service
  app.route('/users/:userId')
    .get(controllers.getUsers) // Docs / service
    .put(controllers.updateUser) // Docs / service
    .delete(controllers.removeUsers); // TODO
  app.route('/admin')
    .post(controllers.adminLogin); // TODO
  app.route('/login')
    .get(controllers.login); // TODO
  app.route('/logout')
    .get(controllers.logout); // TODO
  app.route('/invoice')
    .post(controllers.addInvoice); // TODO
  app.route('/invoice/user/:userId')
    .get(controllers.getUserInvoices); // TODO
  app.route('/invoice/:invoiceId')
    .get(controllers.getInvoice); // TODO
  app.route('/rates')
    .get(controllers.getRates) // TODO
    .post(controllers.addRates); // TODO
  app.route('/rates/:rateId')
    .get(controllers.getRates) // TODO
    .put(controllers.updateRates) // TODO
    .delete(controllers.removeRates) // TODO
};

