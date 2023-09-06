const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { response } = require('express');

const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },
    confirmpassword: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    service: {
        type: String,
       
    },
    namehome: String,
    for: String,
    highlight: String,
    location: String,
    contact: {
        type: Number,
        
        unique: true
    },
    current_status: String,
    image: [{
        url: String,
    }],

})

registerSchema.methods.generateAuthToken = async function () {
    try {

        const token = await jwt.sign({ _id: this._id.toString() }, process.env.secretKey)
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token;


    } catch (error) {
        console.log(error);
    }
}

registerSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmpassword = await bcrypt.hash(this.password, 12);
    }
    next()
})


const Register = new mongoose.model("OwnerRegister", registerSchema)

module.exports = Register