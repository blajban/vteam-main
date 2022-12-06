const controllers = require('./controllers.js');

module.exports = (app) => {
  app.route('/city/:city/parking')
    .get(controllers.getParkingspots);
  app.route('/city/:city/scooter')
    .get(controllers.getScooters)
};