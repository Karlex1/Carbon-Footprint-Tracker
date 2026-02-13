// const jwt = require('jsonwebtoken')
const Emissiondata = require('../Schemas/emissiondataModel')
exports.gethistory = async (req, res) => {
    const userid = req.user.id;
    const data = await Emissiondata.find({ userid: userid }).sort({createdAt:-1}).limit(30);
    if (!data || data.length === 0) {
        return res.status(404).json({ message: "No history found" })
    } else {
        res.status(200).json(data)
    }

}