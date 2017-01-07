const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jwt-simple');
const { User } = require('props-node/models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.find({ where: { id } })
    .then(user => done(null, user))
    .catch(err => done(err, null));
});

passport.use(new LocalStrategy((username, password, done) => {
  User.find({ where: { username } })
    .then((user) => {
      if (!user) return done(null, false);
      if (password !== user.password) return done(null, false);
      return done(null, user);
    })
    .catch(done);
}));

passport.use(new BearerStrategy(() => {
  // ...
}));
