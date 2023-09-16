const mongoose = require('mongoose')

const sendmsgSchema = new mongoose.Schema({
    name:String,
    email:String,
    message:String
})

const sendmsg = new mongoose.model("messages", sendmsgSchema)

module.exports = sendmsg