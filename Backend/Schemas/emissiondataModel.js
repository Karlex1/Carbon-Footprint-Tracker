const mongoose = require('mongoose')
const schema = mongoose.Schema

const emissiondata = new schema({
    totalemission: {
        required: true,
        type: Number,
    },
    unit: {
        type: String,
        required: true
    },
    userid: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,ref:'User',
    },
    value: {
        type: Object,
        default: {}
    },
},
    { timestamps: true })

const EmissionData = mongoose.model("EmissionDatamodel", emissiondata)
module.exports = EmissionData;