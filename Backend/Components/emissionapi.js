require('dotenv').config();
const axios = require('axios');
const EmissionData = require('../Schemas/emissiondataModel');
const Commitment = require('../Schemas/commitmentModel');

const safeNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
};

exports.questionairecalc = async (req, res) => {
    try {
        const formData = req.body;

        const response = await axios.post(
            `${process.env.MLP_URI}/predict`,
            formData,
            { timeout: 35000 }
        );

        const predictedTotal = response?.data?.total_carbon_emission;

        if (!Number.isFinite(predictedTotal)) {
            return res.status(502).json({
                message: 'Invalid response from prediction service'
            });
        }

        const yearlyEmission = Math.round(predictedTotal);
        const monthlyEmission = Math.round(predictedTotal / 12);

        const emissiondata = new EmissionData({
            yearly_totalemission: yearlyEmission,
            monthly_totalemission: monthlyEmission,
            unit: 'kgCO2/year',
            userid: req.user.id,
            value: formData
        });

        await emissiondata.save();

        return res.status(200).json({
            yearly_totalemission: yearlyEmission,
            monthly_totalemission: monthlyEmission,
            message: 'Calculation successful'
        });
    } catch (e) {
        const flaskError = e.response?.data?.error || e.message;
        console.error('Prediction Error Details:', flaskError);

        return res.status(500).json({
            message: 'Prediction service error',
            error: flaskError
        });
    }
};

exports.addCommit = async (req, res) => {
    try {
        const newValue = req.body?.value;
        const userid = req.user.id;

        if (!newValue || typeof newValue !== 'object') {
            return res.status(400).json({
                message: 'Invalid payload: value object is required'
            });
        }

        const activeCommitments = await Commitment.find({
            userid,
            status: 'active'
        });

        const achievements = [];

        for (const goal of activeCommitments) {
            const currentRaw = newValue[goal.category];
            const targetRaw = goal.goalvalue;

            if (currentRaw === undefined || targetRaw === undefined) {
                continue;
            }

            const currentUserValue = String(currentRaw).trim().toLowerCase();
            const targetGoalValue = String(targetRaw).trim().toLowerCase();

            if (currentUserValue === targetGoalValue) {
                achievements.push({
                    category: goal.category,
                    saving: goal.expectedSaving
                });

                goal.status = 'achieved';
                await goal.save();
            }
        }

        return res.status(200).json({
            message: 'Data saved',
            achievements
        });
    } catch (error) {
        console.error('addCommit Error:', error);
        return res.status(500).json({
            message: 'Failed to process commitments',
            error: error.message
        });
    }
};