const SuggestionEngine = require('../Schemas/suggestionModel');
const EmissionData = require('../Schemas/emissiondataModel');
exports.suggestionengine = async (req, res) => {
    try {
        const userid = await req.user.id;
        const lastsurveydata = await EmissionData.findOne({ userid: userid }).sort({ createdAt: -1 });
        if (!lastsurveydata) return res.status(200).json([]); 
        const data = lastsurveydata.value;
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
                const quantity = parseFloat(data[category][activity].quantity);
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
        suggestionarray.sort((a, b) => b.potential_saving - a.potential_saving);
        return res.status(200).json(suggestionarray);
    } catch (e) {
        return res.status(500).json({ message: "Server Error at suggestionengine" });
    }
}