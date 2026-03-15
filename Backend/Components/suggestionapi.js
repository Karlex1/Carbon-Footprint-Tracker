const axios = require('axios');
const EmissionData = require('../Schemas/emissiondataModel');

const HUMAN_TIPS = {
    en: {
        diet_type: {
            omnivore: "Since you eat a bit of everything, swapping a few meat meals for Vegetarian options will save {save}kg!",
            pescatarian: "You're doing well! Moving from fish to a full Vegetarian diet would cut {save}kg more.",
            vegetarian: "Great job being veg! Taking the next step toward Vegan meals could save {save}kg of methane impact.",
            vegan: "You are a sustainability pro! Maintaining this vegan lifestyle saves a massive amount of water and land."
        },
        transport_mode: {
            private: "Private cars are heavy hitters. Trying Public Transport just twice a week could save {save}kg!",
            public: "Public transit is great! If you switch short trips to 'Walk or Bicycle', you'll save {save}kg and stay fit.",
            'walk/bicycle': "Zero-emission hero! You're already at the top of green travel."
        },
        vehicle_fuel_type: {
            diesel: "Diesel has high particulates. Switching to Petrol or Hybrid for your next car reduces local smog and saves {save}kg.",
            petrol: "Petrol is common, but moving toward CNG or Electric would drastically cut {save}kg from your stats.",
            cng: "CNG is clean! Going full Electric for your next vehicle is the final step to saving {save}kg.",
            electric: "Driving the future! Your EV is keeping the air clean for everyone."
        },
        air_travel_frequency: {
            'very frequently': "High flyer! Reducing just one long-haul flight this year would save a massive {save}kg.",
            frequently: "You travel often! Choosing a train for one of your regular routes could save {save}kg.",
            rarely: "Almost there! Avoiding that one 'rare' flight keeps {save}kg of carbon out of the atmosphere.",
            never: "Ground-travel champion! Your choice to avoid flying is the best thing for the climate."
        },
        energy_efficiency_level: {
            No: "Starting with 'Sometimes'—like turning off lights when leaving a room—will save {save}kg and lower bills!",
            Sometimes: "You're halfway there! Making energy efficiency a 'Yes' with LED bulbs saves an extra {save}kg.",
            Yes: "Energy Pro! Your efficient home is a model for sustainable living."
        },
        body_type: {
            obese: "Small steps count! Increasing activity to move toward 'Overweight' saves {save}kg in healthcare resources.",
            overweight: "You're on your way! A bit more active travel to reach 'Normal' helps the planet save {save}kg.",
            normal: "Maintaining a healthy BMI keeps your personal resource consumption optimized.",
            underweight: "Focus on balanced nutrition; a healthy body is the foundation of a green life."
        },
        gender: { male: "Lead by example! Men's lifestyle shifts can drive massive community impact.", female: "Nature Heroine! Your sustainable choices are shaping a greener future." },
        vehicle_distance_km: "You drive {val}km. Reducing this by 10% through 'trip chaining' saves {save}kg!",
        waste_bag_count: "You're at {val} bags. Reducing just one bag a week through composting saves {save}kg.",
        recycling_count: "You recycle {val} items. Adding just one more category like Metal or Glass saves {save}kg.",
        cooking_methods: "Using multiple methods? Sticking to the Microwave or Pressure Cooker saves {save}kg of gas.",
        monthly_grocery_bill: "A high bill often means imported goods. Buying local to lower your bill saves {save}kg.",
        tv_pc_hours_daily: "Digital Detox: Reducing 1 hour of screen time saves {save}kg of power plants' carbon.",
        internet_hours_daily: "Sustainable Surfing: Reducing 1 hour of HD streaming saves {save}kg at the data center.",
        new_clothes_monthly: "Buying {val} items? Choosing one 'thrifted' piece instead saves {save}kg and tons of water."
    },
    hi: {
        diet_type: {
            omnivore: "चूंकि आप सब कुछ खाते हैं, इसलिए कुछ भोजन 'शाकाहारी' चुनने से {save}kg की बचत होगी!",
            pescatarian: "अच्छा कर रहे हैं! मछली के बजाय पूर्ण शाकाहारी भोजन अपनाने से {save}kg और बचेगा।",
            vegetarian: "शाकाहारी होने के लिए बढ़िया! 'वेगन' (Vegan) बनने की ओर अगला कदम {save}kg और बचा सकता है।",
            vegan: "आप स्थिरता के उस्ताद हैं! यह जीवनशैली पानी और जमीन की भारी बचत करती है।"
        },
        transport_mode: {
            private: "निजी कार का प्रभाव अधिक है। हफ्ते में दो बार पब्लिक ट्रांसपोर्ट का उपयोग करने से {save}kg बचेगा!",
            public: "पब्लिक ट्रांसपोर्ट अच्छा है! छोटी यात्राओं के लिए 'पैदल या साइकिल' अपनाने से {save}kg बचेगा।",
            'walk/bicycle': "जीरो-एमिशन हीरो! आप पहले से ही पर्यावरण के लिए सबसे अच्छा कर रहे हैं।"
        },
        vehicle_fuel_type: {
            diesel: "डीजल से प्रदूषण अधिक होता है। अगली बार पेट्रोल या हाइब्रिड चुनने से {save}kg की बचत होगी।",
            petrol: "पेट्रोल सामान्य है, लेकिन सीएनजी या इलेक्ट्रिक अपनाने से {save}kg की भारी कमी आएगी।",
            cng: "सीएनजी स्वच्छ है! अगली गाड़ी इलेक्ट्रिक लेना {save}kg बचाने का आखिरी कदम होगा।",
            electric: "भविष्य की सवारी! आपकी इलेक्ट्रिक गाड़ी हवा को शुद्ध रख रही है।"
        },
        air_travel_frequency: {
            'very frequently': "एक लंबी उड़ान कम करने से इस साल भारी {save}kg की बचत हो सकती है।",
            frequently: "ट्रेन का विकल्प चुनें, इससे आपकी यात्रा में {save}kg कार्बन की कमी आएगी।",
            rarely: "बस थोड़ा और! उस एक 'कभी-कभार' वाली उड़ान से बचकर {save}kg बचाएं।",
            never: "जमीनी यात्रा के चैंपियन! उड़ानों से बचना जलवायु के लिए सबसे अच्छा है।"
        },
        energy_efficiency_level: {
            No: "लाइट्स बंद करने जैसी छोटी आदतों से शुरुआत करें, इससे {save}kg बचेगा और बिल भी कम होगा!",
            Sometimes: "आप आधे रास्ते पर हैं! LED बल्ब अपनाकर ऊर्जा दक्षता को 'हाँ' में बदलें और {save}kg बचाएं।",
            Yes: "एनर्जी प्रो! आपका घर टिकाऊ जीवन का एक उदाहरण है।"
        },
        body_type: {
            obese: "छोटे कदम मायने रखते हैं! थोड़ी सक्रियता बढ़ाने से स्वास्थ्य संसाधनों में {save}kg की बचत होगी।",
            overweight: "आप सही रास्ते पर हैं! 'सामान्य' वजन तक पहुँचने के लिए पैदल चलना {save}kg बचाएगा।",
            normal: "स्वस्थ BMI बनाए रखना आपके व्यक्तिगत संसाधनों की खपत को संतुलित रखता है।",
            underweight: "संतुलित आहार पर ध्यान दें; स्वस्थ शरीर ही हरित जीवन की नींव है।"
        },
        gender: { male: "उदाहरण पेश करें! पुरुषों की जीवनशैली में बदलाव समुदाय पर बड़ा प्रभाव डाल सकता है।", female: "प्रकृति नायिका! आपके चुनाव एक हरित भविष्य का निर्माण कर रहे हैं।" },
        vehicle_distance_km: "आप {val}km चलते हैं। इसे 10% कम करने से {save}kg की बचत होगी!",
        waste_bag_count: "आप {val} बैग कचरा निकालते हैं। खाद (Composting) बनाकर एक बैग कम करने से {save}kg बचेगा।",
        recycling_count: "आप {val} चीजें रीसायकल करते हैं। धातु या कांच को जोड़ने से {save}kg और बचेगा।",
        cooking_methods: "प्रेशर कुकर या माइक्रोवेव का अधिक उपयोग करने से {save}kg गैस की बचत होगी।",
        monthly_grocery_bill: "स्थानीय सामान खरीदने से आपके बिल और 'फूड माइल्स' में {save}kg की कमी आएगी।",
        tv_pc_hours_daily: "डिजिटल डिटॉक्स: स्क्रीन टाइम में 1 घंटे की कमी {save}kg बिजली के कार्बन को बचाती है।",
        internet_hours_daily: "HD स्ट्रीमिंग में 1 घंटे की कमी डेटा सेंटर पर {save}kg की बचत करती है।",
        new_clothes_monthly: "नए कपड़ों के बजाय पुराने कपड़ों को फिर से इस्तेमाल करना {save}kg और पानी बचाता है।"
    }
};

exports.suggestionengine = async (req, res) => {
    try {
        const userid = req.user.id;
        const lastsurvey = await EmissionData.findOne({ userid }).sort({ createdAt: -1 });
        if (!lastsurvey) return res.status(200).json([]);

        const flaskRes = await axios.post(`${process.env.MLP_URI}/suggestion`, lastsurvey.value);
        let suggestions = flaskRes.data;

        // CRITICAL: Ensure we detect language correctly
        const userLang = req.headers['accept-language'] === 'hi' ? 'hi' : 'en';

        const refined = suggestions.map(s => {
            // 1. Get current value from user's last survey
            const currentVal = lastsurvey.value[s.category];

            // 2. Look up the humanized category
            const categoryMap = HUMAN_TIPS[userLang][s.category];

            let finalTip = s.tip; // Fallback to raw tip

            if (categoryMap) {
                // 3. Match the tip based on the CURRENT habit
                const template = (typeof categoryMap === 'object') ? categoryMap[currentVal] : categoryMap;

                if (template) {
                    finalTip = template
                        .replace(/{save}/g, s.potential_saving)
                        .replace(/{val}/g, currentVal || '0');
                }
            }

            return { ...s, tip: finalTip };
        });

        res.status(200).json(refined.slice(0, 3));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};