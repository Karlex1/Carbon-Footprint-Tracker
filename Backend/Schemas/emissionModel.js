const mongoose = require('mongoose')
const schema = mongoose.Schema

const emissionFactor = new schema({
    category: {
        type: String,
        required:true,
    }, activity: {
        type: String,
        required:true
    }, emission_factor: {
        type: Number,
        required: true
    }, unit: {
        type:String
    }
})

const Data = mongoose.model("emissiondata", emissionFactor);
module.exports = Data;