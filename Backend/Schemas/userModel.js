const mongoose = require("mongoose");
const schema = mongoose.Schema

const user = new schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobileno: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })
const User = mongoose.model("User", user)
module.exports = User