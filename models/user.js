const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);//automatically generate username, hashing, salting, password

module.exports = mongoose.model("User", userSchema);