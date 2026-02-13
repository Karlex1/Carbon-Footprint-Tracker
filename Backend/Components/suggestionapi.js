const SuggestionEngine = require('../Schemas/suggestionModel');

exports.suggestionengine = async (req, res) => {
    try {
        const data = req.body;
        const allsuggestion = await SuggestionEngine.find({});
        const suggestionarray = [];
        const suggestionMap = {};
        allsuggestion.forEach(
            item => {
                suggestionMap[`${item.trigger_activity}`] = item;
            }
        );
        for (const category in data) {
            if (typeof data[category] !== 'object') continue;
            // breakdown[category] = {};

            for (const activity in data[category]) {
                const quantity = parseFloat(data[category][activity]);
                if (isNaN(quantity) || quantity <= 0) continue;
                const key = `${activity}`;
                const triggerdata = suggestionMap[key];
                if (!triggerdata) continue;
                if (triggerdata && quantity > triggerdata.threshold) {
                    suggestionarray.push({
                        activity: activity,
                        replacement: triggerdata.replacement_activity,
                        tip: triggerdata.tip,
                        potential_saving: parseFloat((quantity * triggerdata.delta_saving).toFixed(2))
                    });
                }
            }
        }
        return res.status(200).json(suggestionarray);
    } catch (e) {
        return res.status(500).json({ message: "Server Error at suggestionengine" });
    }
}