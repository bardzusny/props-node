const SwaggerExpress = require('swagger-express-mw');
const passport = require('passport');
const app = require('express')();

require('./initializers/passport');

module.exports = app; // for testing

const config = {
  appRoot: __dirname, // required config
};

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) { throw err; }

  // install middleware
  app.use(passport.initialize());

  app.use('/api/users/login', passport.authenticate('local', { session: false }));
  // TODO: list of authenticated routes must be held/handled in a better way than this
  ['/api/props'].forEach((path) => {
    app.use(path, passport.authenticate('bearer', { session: false }));
  });

  swaggerExpress.register(app);

  const port = process.env.PORT || 10010;
  app.listen(port);
});
