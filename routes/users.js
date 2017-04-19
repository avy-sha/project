/**
 * Created by Abhinav on 20-02-2017.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var SCOPES = ['profile',
    'https://www.googleapis.com/auth/gmail.modify'];
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/google', passport.authenticate('google', { scope: SCOPES }),
    function(req, res){});


router.get('/google/callback', function(req,res,next){
    passport.authenticate('google', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            var token = Verify.getToken(user);
            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req,res,next);
});
router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

module.exports = router;