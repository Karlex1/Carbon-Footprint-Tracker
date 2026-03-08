const Commitment = require('../Schemas/commitmentModel');

exports.commitToTip = async (req, res) => {
    try {
        const { category, replacement, potential_saving } = req.body;

        await Commitment.updateMany({ userid: req.user.id, category, status: 'active' }, { status: 'replaced' });
        const newCommitment = new Commitment({
            userid: req.user.id,
            category,
            goalvalue: replacement,
            expectedSaving: potential_saving
        })
        await newCommitment.save();
        res.status(201).json({ message: "Commitment Recorded. We are rooting for you!!" })
    } catch (e) {
        res.status(500).json({ message: "Error saving commitment" });
    }
}