/**
 * Created by Abhinav on 25-02-2017.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var config = require('./config');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var request = require('request');


/*exports.local=passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());*/

exports.google=passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken,mail, done) {
    console.log(accessToken);

//MAIN REQUEST CODE TO GET THE THREAD AND MAILS TO FIX THIS
        request({
                method: "GET",
                uri: "https://www.googleapis.com/gmail/v1/users/me/profile",
                headers: {
                    "access_token":accessToken,
                    "refresh_token":refreshToken,
                    "token_type": 'Bearer',
                    "Content-Type": "application/json"
                },
            },
            function(err, response, body) {
                if(err){
                    console.log(err); // Failure
                } else {
                    console.log(response);
                     done(null);// Success!
                }
            });
    }
));
