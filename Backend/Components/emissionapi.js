const Emission = require('../Schemas/emissionModel');
const EmissionData = require('../Schemas/emissiondataModel');

exports.questionairecalc = async (req, res) => {
    try {
        const data = req.body;
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
            if (typeof data[category] !== 'object') continue;
            breakdown[category] = {};

            for (const activity in data[category]) {
                const quantity = parseFloat(data[category][activity]);
                if (isNaN(quantity) || quantity <= 0) continue;

                const key = `${category}_${activity}`;
                const factor = factorMap[key];
                if (!factor) continue;

                const emission = quantity * factor.emission_factor;

                breakdown[category][activity] = {
                    quantity,
                    unit: factor.unit,
                    emission_factor: factor.emission_factor.toFixed(2),
                    emission
                };

                totalEmission += emission;
            }
            console.log(breakdown);
        }
        
        const emissiondata = new EmissionData({
            totalemission: totalEmission,
            unit: "kgCO2",
            userid:req.user.id,
            value:breakdown
        })
        console.log(emissiondata);
        
        await emissiondata.save();
        return res.status(200).json({
            totalEmission: Number(totalEmission.toFixed(2)),
            breakdown
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server failure at calculation" });
    }
};
