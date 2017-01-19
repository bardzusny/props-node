require('dotenv').config();

const SwaggerExpress = require('swagger-express-mw');
const passport = require('passport');
const app = require('express')();

require('./initializers/promisification');
require('./initializers/passport');

module.exports = app; // for testing

const config = {
  appRoot: __dirname, // required config
};

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) { throw err; }

  app.use(passport.initialize());

  swaggerExpress.register(app);

  const port = process.env.PORT || 10010;
  app.listen(port);
});
