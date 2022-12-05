const controllers = require('./controllers.js');

module.exports = (app) => {
  app.route('/test')
    .get(controllers.getTest)
    .post(controllers.createTest);
};