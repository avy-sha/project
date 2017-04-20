/**
 * Created by Abhinav on 25-02-2017.
 */
var passport = require('passport');
var config = require('./config');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var User = require('./models/user');
var google = require('googleapis');
var latestmsg;
var latestthread;
var firsttime=2;
var Type = require('type-of-is');
exports.local=passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.google=passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken,profile, done) {
        process.nextTick(function() {
            User.findOne({ username: profile.emails[0].value }, function(err, user) {
                if(err) {
                    console.log(err); // handle errors!
                }
                if (!err && user !== null) {
                    firsttime=0;
                    listmessages(user,accessToken);
                    done(null, user);
                }
                else {
                    request({
                            url: 'https://www.googleapis.com/gmail/v1/users/me/messages',
                            method: 'GET',
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer "+accessToken
                            },
                            qs: {
                                "maxResults":1
                            }
                        },
                        function (err, response, body) {
                            if(err){
                                console.log(err); // Failure
                            } else {
                                body=JSON.parse(body);
                                var messages=body.messages;
                                latestmsg=messages[0].id;
                                latestthread=messages[0].threadId;
                                console.log(messages[0]);
                                console.log(latestthread);
                                user = new User({
                                    username: profile.emails[0].value,
                                    lastmsg : latestmsg,
                                    lastthread :latestthread
                                });
                                user.save(function(err) {
                                    if(err) {
                                        console.log(err); // handle errors!
                                    } else {
                                        console.log("saving user ...");
                                        firsttime=1;
                                        listmessages(user,accessToken);
                                        done(null, user);
                                    }
                                });
                            }
                        });

                }
            });})

    }
));
function listmessages(user,accessToken){
    request({
            url: 'https://www.googleapis.com/gmail/v1/users/me/messages',
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+accessToken
            },
            qs: {
                "q": "newer_than:30d"
            }
        },
        function (err, response, body) {
            if(err){
                console.log(err); // Failure
            } else {
                var number;
                var body=JSON.parse(body);
                var messages=body.messages;
                if(firsttime!=1){
                    for(var i=0;messages[i];i++){
                        if(messages[i].threadId==user.lastthread&&messages[i].id==user.lastmsg){
                            number=i;
                            break;
                        }
                        else number=i;
                    }
                }
                else{
                    for(var i=0;messages[i];i++){
                        number=i;
                    }
                }
                console.log(number);

                for(var i=0;i<=number;i++){
                    //console.log(messages[i].threadId);
                    var currthread=messages[i].threadId;
                    var currmsg=messages[i].id;

                    User.findOne({ username: user.username }, function(err, updateuser) {
                        if(err) {
                            console.log(err); // handle errors!
                        }
                        if (!err && updateuser !== null) {
                            var newthread=0;
                            //for checking
                            console.log(updateuser.threads);
                            for(var j=0;updateuser.threads[j];j++)
                            {       console.log("yes");
                                if(updateuser.threads[j].threadid==currthread){
                                    console.log("yes");
                                    //code for email body retrieve will come here
                                    updateuser.threads[j].emails.push({emailid:currmsg});
                                    newthread=1;
                                    updateuser.save(function(err) {});
                                    break;

                                }
                            }
                            if(newthread!=1){
                                var email={emailid:currmsg};
                                updateuser.threads.push({threadid: currthread,emails:email});
                                updateuser.save(function(err) {});}
                        }
                    });
                }

                if(body.nextPageToken){
                    console.log("boop");
                    nextpagetoken=response.nextPageToken;
                    listnextmessagepage(user,gmail,oauth2Client,nextpagetoken);

                }
            }
        });


}
function listnextmessagepage(user,oauth2Client,nextpagetoken){

    request({
            url: 'https://www.googleapis.com/gmail/v1/users/me/messages',
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+accessToken
            },
            qs: {
                "q": "newer_than:30d",
                "pageToken":nextpagetoken
            }
        },
        function (err, response, body) {
            if(err){
                console.log(err); // Failure
            } else {
                var number;
                var body=JSON.parse(body);
                var messages=body.messages;
                if(firsttime!=1){
                    for(var i=0;messages[i];i++){
                        if(messages[i].threadId==user.lastthread&&messages[i].id==user.lastmsg){
                            number=i;
                            break;
                        }
                        else number=i;
                    }
                }
                else{
                    for(var i=0;messages[i];i++){
                        number=i;
                    }
                }
                console.log(number);

                for(var i=0;i<=number;i++){
                    //console.log(messages[i].threadId);
                    var currthread=messages[i].threadId;
                    var currmsg=messages[i].id;

                    User.findOne({ username: user.username }, function(err, updateuser) {
                        if(err) {
                            console.log(err); // handle errors!
                        }
                        if (!err && updateuser !== null) {
                            var newthread=0;
                            //for checking
                            console.log(updateuser.threads);
                            for(var j=0;updateuser.threads[j];j++)
                            {       console.log("yes");
                                if(updateuser.threads[j].threadid==currthread){
                                    console.log("yes");
                                    //code for email body retrieve will come here
                                    updateuser.threads[j].emails.push({emailid:currmsg});
                                    newthread=1;
                                    updateuser.save(function(err) {});
                                    break;

                                }
                            }
                            if(newthread!=1){
                                var email={emailid:currmsg};
                                updateuser.threads.push({threadid: currthread,emails:email});
                                updateuser.save(function(err) {});}
                        }
                    });
                }

                if(response.nextPageToken){
                    nextpagetoken=response.nextPageToken;
                    listnextmessagepage(user,gmail,oauth2Client,nextpagetoken);

                }
            }
        });

}
