const mongoose = require('mongoose');

const commitmentSchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: String,
    goalvalue: String,
    expectedSaving: Number,
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Commitment', commitmentSchema);