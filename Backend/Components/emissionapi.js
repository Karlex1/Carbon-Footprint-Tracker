require('dotenv').config();
const axios = require('axios');
const EmissionData = require('../Schemas/emissiondataModel');
exports.questionairecalc = async (req, res) => {
    try {
        const formData = req.body;

        // Call Flask Predictor
        const response = await axios.post(`${process.env.MLP_URI}/predict`, formData,{timeout:35000});

        // This key MUST match the Flask response
        const predictedTotal = response.data.total_carbon_emission;

        if (predictedTotal === undefined) {
            throw new Error("Invalid response from prediction service");
        }

        const emissiondata = new EmissionData({
            yearly_totalemission: Math.round(predictedTotal), // Round for cleaner DB storage
            monthly_totalemission:Math.round(predictedTotal/12),
            unit: 'kgCO2/year',
            userid: req.user.id,
            value: formData // Stores the raw answers for future reference
        });

        await emissiondata.save();

        return res.status(200).json({
            yearly_totalemission: Math.round(predictedTotal),
            monthly_totalemission: Math.round(predictedTotal / 12),
            message: 'Calculation successful'
        });

    } catch (e) {
        const flaskError = e.response ? e.response.data.error : e.message;
        console.error("Prediction Error Details:", flaskError);

        return res.status(500).json({
            message: "Prediction service error",
            error: flaskError
        });
    }
}
