const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog-app-bootcamp');
const Schema = mongoose.Schema;



var UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    type: Number,
    jwt: String
});


var userInfo = mongoose.model('user', UserSchema);

module.exports = userInfo ; 
 