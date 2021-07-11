const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
    username:{
        type: String,
        required: [true,"Please provide a Username"],
        unique: true
    },
    password:{
        type: String,
        required: [true,"Please provide a Password"]
    }
});

UserSchema.plugin(uniqueValidator);
UserSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

const User = mongoose.model('User',UserSchema);
module.exports = User