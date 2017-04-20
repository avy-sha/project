
/**
 * Created by Abhinav on 20-02-2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var email = new Schema({
    emailid: String,
    body: String
});
var thread = new Schema({
    threadid: String,
    emails: [email]
});
var User = new Schema({
    username: String,
    threads: [thread],
    lastmsg: String,
    lastthread: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);

