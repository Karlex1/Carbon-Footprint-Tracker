const Emission = require('../Schemas/emissionModel');

exports.questionairecalc = async (req, res) => {
    try {
        const data = req.body;
        // console.log(data);
        
        let totalEmission = 0;
        let breakdown = {};

        // Fetch all emission factors once
        const allFactors = await Emission.find({});

        // Create lookup map
        const factorMap = {};
        allFactors.forEach(item => {
            factorMap[`${item.category}_${item.activity}`] = item;
        });
// console.log(allFactors);

        for (const category in data) {
            breakdown[category] = {};

            for (const activity in data[category]) {
                const quantity = Number(data[category][activity]);
                if (!quantity || quantity <= 0) continue;

                const key = `${category}_${activity}`;
                const factor = factorMap[key];
                if (!factor) continue;

                const emission = quantity * factor.emission_factor;

                breakdown[category][activity] = {
                    quantity,
                    unit: factor.unit,
                    emission_factor: factor.emission_factor,
                    emission
                };

                totalEmission += emission;
            }
        }

        return res.status(200).json({
            totalEmission: Number(totalEmission.toFixed(2)),
            breakdown
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server failure at calculation" });
    }
};
