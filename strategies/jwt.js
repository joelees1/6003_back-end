const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const users = require('../models/users');
const config = require('../config');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
  };

// user goes to /login to get a token sent back in the response if the username and password are correct
// token is added to the header of the request
// passport middleware checks the token in the header of the request
// if the token is valid, the user is authenticated

const checkJwt = async (jwtPayload, done) => {
    try {
        console.log(jwtPayload)
        const [user] = await users.findByUsername(jwtPayload.username);
        const result = user[0]; // get the first row from the results

        if (!result || result.length === 0) {
            console.log(`No user found with username ${jwtPayload.username}`); // not found
            return done(null, false);
        }
        console.log(`Successfully authenticated user ${jwtPayload.username}`); // success
        return done(null, result); // returns user to ctx, allows author id to be added to article
    } catch (error) {
        console.error(`Error during authentication for user ${jwtPayload.username}`); // error
        return done(error);
    }
}
  
const strategy = new JwtStrategy(jwtOptions, checkJwt);
module.exports = strategy;
