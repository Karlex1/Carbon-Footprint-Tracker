const EmissionData = require('../Schemas/emissiondataModel');
const axios = require('axios');

exports.suggestionengine = async (req, res) => {
    try {
        const userid = await req.user.id;
        const lastsurveydata = await EmissionData.findOne({ userid: userid }).sort({ createdAt: -1 });

        if (!lastsurveydata) return res.status(200).json({ message: "No history found" }); 
        
        const flaskRes = await axios.post(`${process.env.MLP_URI}/suggestion`, lastsurveydata.value);

        res.status(200).json(flaskRes.data);
    } catch (e) {
        console.error("Flask Connection Error:", e.message);
        return res.status(500).json({ message: "Server Error at suggestionengine" });
    }
}