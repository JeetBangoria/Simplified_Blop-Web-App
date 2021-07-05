const User = require('../models/UserSchema.js')
const path = require('path')
module.exports = (req, res) => {
    User.create(req.body, (error, user) => {
        console.log(error)
        res.redirect('/')
    })
}