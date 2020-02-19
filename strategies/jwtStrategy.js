const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../models/UserModel');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

module.exports = new JwtStrategy(opts, (payload, done) => {
    User.findById({_id: payload.id})
    .then(user => {
        if(user) {
            return done(null, true);
        } else {
            return done(null, false);
        };
    })
    .catch(err => {
        return done(err);
    });
});