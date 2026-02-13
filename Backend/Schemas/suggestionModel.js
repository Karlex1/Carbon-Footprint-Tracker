const mongoose = require('mongoose');

const schema = mongoose.Schema

const SuggestionEngine = new schema(
    {
        trigger_activity: {
            type: String,
            required: true,
            unique: true,
            trim:true
        },
        threshold: {
            type: Number,
            required:true,
        }
        , replacement_activity: {
            type: String,
            required:true,
        },
        delta_saving: {
            type: Number,
            required:true
        },
        tip: {
            type: String,
            required:true,
        }
    },{timestamps:true}
)

const Data = mongoose.model("SuggestionEngine", SuggestionEngine)
module.exports = Data;