const controllers = require('./controllers.js');

module.exports = (app) => {
  app.route('/city')
    .get(controllers.getCities);
  app.route('/city/:city')
    .get(controllers.getCities)
    .put(controllers.updateCities);
  app.route('/city/:city/scooter')
    .get(controllers.getScooters) //OK
    .post(controllers.addScooter); //OK
  app.route('/city/:city/scooter/:scooterId')
    .get(controllers.getScooters) //OK
    .put(controllers.updateScooter) //OK
    .delete(controllers.removeScooter); //OK
  app.route('/city/:city/parking')
    .get(controllers.getParkingspots) //OK
    .post(controllers.addParkingspot); // Todo
  app.route('/city/:city/parking/:parkingId')
    .get(controllers.getParkingspots)
    .put(controllers.updateParkingspot) // Todo
    .delete(controllers.removeParkingspot); // Todo
  app.route('/city/:city/charging')
    .get(controllers.getChargingStations) //OK
    .post(controllers.addChargingStation); // Todo
  app.route('/city/:city/charging/:chargingId')
    .get(controllers.getChargingStations) //OK
    .put(controllers.updateChargingStation) // Todo
    .delete(controllers.removeChargingStation); // Todo
  app.route('/users')
    .get(controllers.getUsers) //OK
    .post(controllers.addUser); // Todo
  app.route('/users/:userId')
    .get(controllers.getUsers) //OK
    .put(controllers.updateUser) // Todo
    .delete(controllers.removeUsers);
  app.route('/admin')
    .post(controllers.adminLogin);
  app.route('/login')
    .get(controllers.login);
  app.route('/logout')
    .get(controllers.logout);
  app.route('/invoice')
    .post(controllers.addInvoice);
  app.route('/invoice/user/:userId')
    .get(controllers.getUserInvoices);
  app.route('/invoice/:invoiceId')
    .get(controllers.getInvoice);
  app.route('/rates')
    .get(controllers.getRates)
    .post(controllers.addRates);
  app.route('/rates/:rateId')
    .get(controllers.getRates)
    .put(controllers.updateRates)
    .delete(controllers.removeRates)
};