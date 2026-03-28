import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { 
    Container, Paper, Typography, Grid, TextField, MenuItem, 
    Button, Checkbox, FormControlLabel, Box, CircularProgress, 
    Stepper, Step, StepLabel, Fade, Stack 
} from "@mui/material";
import { 
    CheckCircle, ArrowBack, Co2, EmojiPeople, 
    LocalShipping, Yard, Devices 
} from "@mui/icons-material";
import { AuthContext } from "./AuthContext";
import { useLanguage } from './LangContext';
import './questionaire.css';

const translations = {
    en: {
        title: "Carbon Footprint Tracker",
        subtitle: "India-based accurate ML based website",
        info:"🌱 Powered by AI-based prediction",
        steps: ['Profile', 'Travel', 'Lifestyle', 'Digital'],
        next: "Next", back: "Back", submit: "Calculate",
        loading: "Analyzing your lifestyle...", loading2: " Preparing your personalized impact report", finished: "Prediction Finished!", redirect: "Redirecting...",
        endml:" Your result is based on pattern analysis of lifestyle data",
        buttonnote:" 🌱 Takes less than 30 seconds — get your personalized carbon impact instantly",
        labels: {
            bodyType: "Body Type", gender: "Gender", diet: "Diet",
            mode: "Transport Mode", fuel: "Fuel Type", distance: "Monthly KM", flights: "Flights",
            waste: "Weekly Bags", energy: "Energy Saving",
            recycling: "Recycling Habits", cooking: "Cooking Habits", bill: "Grocery Bill (₹)",
            screen: "Screen Time (hrs)", internet: "Internet (hrs)", clothes: "New Clothes (pcs)"
        },
        opt: {
            body: { underweight: 'Underweight', normal: 'Normal', overweight: 'Overweight', obese: 'Obese' },
            gen: { male: 'Male', female: 'Female' },
            diet: { vegetarian: 'Vegetarian', vegan: 'Vegan', omnivore: 'Omnivore', pescatarian: 'Pescatarian' },
            mode: { public: 'Public', private: 'Private', 'walk/bicycle': 'Walk/Bicycle' },
            fuel: { petrol: 'Petrol', diesel: 'Diesel', electric: 'Electric', cng: 'CNG' },
            freq: { never: 'Never', rarely: 'Rarely', frequently: 'Frequently', 'very frequently': 'Very Frequently' },
            yesNo: { Yes: 'Yes', No: 'No', Sometimes: 'Sometimes' },
            recycling: { Paper: 'Paper', Plastic: 'Plastic', Glass: 'Glass', Metal: 'Metal' },
            cooking: { Stove: 'Stove', Oven: 'Oven', Microwave: 'Microwave', Grill: 'Grill' }
        }
    },
    hi: {
        title: "कार्बन फुटप्रिंट ट्रैकर",
        subtitle: "भारत आधारित सटीक ML आधारित वेबसाइट",
        info:"🌱 AI-आधारित पूर्वानुमान द्वारा संचालित",
        steps: ['प्रोफाइल', 'यात्रा', 'जीवनशैली', 'डिजिटल'],
        next: "आगे", back: "पीछे", submit: "गणना करें",
        loading: "आपकी जीवनशैली का विश्लेषण...", loading2: "अपनी व्यक्तिगत प्रभाव रिपोर्ट तैयार करना", finished: "गणना पूरी हुई!", redirect: "डैशबोर्ड पर जा रहे हैं...",
        endml:"आपका परिणाम जीवनशैली डेटा के पैटर्न विश्लेषण पर आधारित है।",
        buttonnote:"🌱 30 सेकंड से भी कम समय लगता है — अपना पर्सनलाइज़्ड कार्बन प्रभाव तुरंत जानें।",
        labels: {
            bodyType: "शरीर का प्रकार", gender: "लिंग", diet: "आहार",
            mode: "यात्रा साधन", fuel: "ईंधन का प्रकार", distance: "मासिक किमी", flights: "उड़ानें",
            waste: "साप्ताहिक बैग", energy: "ऊर्जा बचत",
            recycling: "रीसाइक्लिंग आदतें", cooking: "खाना पकाने की आदतें", bill: "किराना बिल (₹)",
            screen: "स्क्रीन समय (घंटे)", internet: "इंटरनेट (घंटे)", clothes: "नए कपड़े (संख्या)"
        },
        opt: {
            body: { underweight: 'कम वजन', normal: 'सामान्य', overweight: 'अधिक वजन', obese: 'मोटापा' },
            gen: { male: 'पुरुष', female: 'महिला' },
            diet: { vegetarian: 'शाकाहारी', vegan: 'वेगन', omnivore: 'सर्वाहारी', pescatarian: 'मछलीहारी' },
            mode: { public: 'सार्वजनिक', private: 'निजी', 'walk/bicycle': 'पैदल/साइकिल' },
            fuel: { petrol: 'पेट्रोल', diesel: 'डीजल', electric: 'इलेक्ट्रिक', cng: 'सीएनजी' },
            freq: { never: 'कभी नहीं', rarely: 'कभी-कभी', frequently: 'अक्सर', 'very frequently': 'बहुत अक्सर' },
            yesNo: { Yes: 'हाँ', No: 'नहीं', Sometimes: 'कभी-कभी' },
            recycling: { Paper: 'कागज', Plastic: 'प्लास्टिक', Glass: 'कांच', Metal: 'धातु' },
            cooking: { Stove: 'चूल्हा', Oven: 'ओवन', Microwave: 'माइक्रोवेव', Grill: 'ग्रिल' }
        }
    }
};

const Questionnaire = () => {
    const { isTokenValid } = useContext(AuthContext);
    const { lang } = useLanguage();
    const t = translations[lang || 'en'];
    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [form, setForm] = useState({
        body_type: 'normal', gender: 'male', diet_type: 'vegetarian',
        transport_mode: 'public', vehicle_fuel_type: 'petrol',
        air_travel_frequency: 'never', vehicle_distance_km: 50,
        waste_bag_count: 2, energy_efficiency_level: 'No',
        monthly_grocery_bill: 2000, tv_pc_hours_daily: 4,
        new_clothes_monthly: 1, internet_hours_daily: 3,
        recycling_items: [], cooking_methods: []
    });

    const CustomStepIcon = ({ active, completed, icon }) => {
        const icons = { 1: <EmojiPeople />, 2: <LocalShipping />, 3: <Yard />, 4: <Devices /> };
        return (
            <div className={`step-icon ${active || completed ? 'step-active' : 'step-inactive'}`}>
                {icons[icon]}
            </div>
        );
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    
    const handleCheckChange = (listName, itemKey) => {
        const current = form[listName];
        const updated = current.includes(itemKey) ? current.filter(i => i !== itemKey) : [...current, itemKey];
        setForm({ ...form, [listName]: updated });
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token || !isTokenValid(token)) { navigate('/login'); return; }
        setLoading(true);

        const payload = {
            ...form,
            vehicle_distance_km: Number(form.vehicle_distance_km),
            waste_bag_count: Number(form.waste_bag_count),
            monthly_grocery_bill: Number(form.monthly_grocery_bill),
            tv_pc_hours_daily: Number(form.tv_pc_hours_daily),
            internet_hours_daily: Number(form.internet_hours_daily),
            new_clothes_monthly: Number(form.new_clothes_monthly),
            recycling_count: form.recycling_items.length,
            cooking_count: form.cooking_methods.length || 1,
        };
        delete payload.recycling_items; delete payload.cooking_methods;

        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/questionnaire`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                setResult(data);
                const achRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/addcommit`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ value: payload })
                });
                const achData = await achRes.json();
                setTimeout(() => navigate('/dashboard', { state: { achievements: achData.achievements } }), 2500);
            }
        } catch (err) { alert("Server Error"); }
        finally { setLoading(false); }
    };

    const renderStepContent = (step) => {
        const opt = t.opt;
        switch (step) {
            case 0: return (
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={4} display="flex"><TextField select fullWidth size="small" className="q-input" label={t.labels.bodyType} name="body_type" value={form.body_type} onChange={handleChange}>{Object.keys(opt.body).map(k => <MenuItem key={k} value={k}>{opt.body[k]}</MenuItem>)}</TextField></Grid>
                    <Grid item xs={12} sm={4} display="flex"><TextField select fullWidth size="small" className="q-input" label={t.labels.gender} name="gender" value={form.gender} onChange={handleChange}>{Object.keys(opt.gen).map(k => <MenuItem key={k} value={k}>{opt.gen[k]}</MenuItem>)}</TextField></Grid>
                    <Grid item xs={12} sm={4} display="flex"><TextField select fullWidth size="small" className="q-input" label={t.labels.diet} name="diet_type" value={form.diet_type} onChange={handleChange}>{Object.keys(opt.diet).map(k => <MenuItem key={k} value={k}>{opt.diet[k]}</MenuItem>)}</TextField></Grid>
                </Grid>
            );
            case 1: return ( // 2x2 Grid Layout
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={6} display="flex"><TextField select fullWidth size="small" className="q-input" label={t.labels.mode} name="transport_mode" value={form.transport_mode} onChange={handleChange}>{Object.keys(opt.mode).map(k => <MenuItem key={k} value={k}>{opt.mode[k]}</MenuItem>)}</TextField></Grid>
                    <Grid item xs={6} display="flex"><TextField select fullWidth size="small" className="q-input" label={t.labels.fuel} name="vehicle_fuel_type" value={form.vehicle_fuel_type} onChange={handleChange}>{Object.keys(opt.fuel).map(k => <MenuItem key={k} value={k}>{opt.fuel[k]}</MenuItem>)}</TextField></Grid>
                    <Grid item xs={6} display="flex"><TextField fullWidth size="small" type="number" className="q-input" label={t.labels.distance} name="vehicle_distance_km" value={form.vehicle_distance_km} onChange={handleChange} /></Grid>
                    <Grid item xs={6} display="flex"><TextField select fullWidth size="small" className="q-input" label={t.labels.flights} name="air_travel_frequency" value={form.air_travel_frequency} onChange={handleChange}>{Object.keys(opt.freq).map(k => <MenuItem key={k} value={k}>{opt.freq[k]}</MenuItem>)}</TextField></Grid>
                </Grid>
            );
            case 2: return (
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={6} display="flex"><TextField fullWidth size="small" type="number" className="q-input" label={t.labels.waste} name="waste_bag_count" value={form.waste_bag_count} onChange={handleChange} /></Grid>
                    <Grid item xs={6} display="flex"><TextField select fullWidth size="small" className="q-input" label={t.labels.energy} name="energy_efficiency_level" value={form.energy_efficiency_level} onChange={handleChange}>{Object.keys(opt.yesNo).map(k => <MenuItem key={k} value={k}>{opt.yesNo[k]}</MenuItem>)}</TextField></Grid>
                    <Grid item xs={12}><Box className="q-check-group"><Typography variant="caption" fontWeight="bold" color="success.dark">{t.labels.recycling}</Typography><Box display="flex" flexWrap="wrap">{Object.keys(opt.recycling).map(k => <FormControlLabel key={k} control={<Checkbox size="small" color="success" checked={form.recycling_items.includes(k)} onChange={() => handleCheckChange('recycling_items', k)} />} label={<Typography variant="caption">{opt.recycling[k]}</Typography>} />)}</Box></Box></Grid>
                    <Grid item xs={12}><Box className="q-check-group"><Typography variant="caption" fontWeight="bold" color="warning.dark">{t.labels.cooking}</Typography><Box display="flex" flexWrap="wrap">{Object.keys(opt.cooking).map(k => <FormControlLabel key={k} control={<Checkbox size="small" color="warning" checked={form.cooking_methods.includes(k)} onChange={() => handleCheckChange('cooking_methods', k)} />} label={<Typography variant="caption">{opt.cooking[k]}</Typography>} />)}</Box></Box></Grid>
                </Grid>
            );
            case 3: return ( // 2x2 Grid Layout
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={6} display="flex"><TextField fullWidth size="small" className="q-input" label={t.labels.screen} name="tv_pc_hours_daily" type="number" value={form.tv_pc_hours_daily} onChange={handleChange} /></Grid>
                    <Grid item xs={6} display="flex"><TextField fullWidth size="small" className="q-input" label={t.labels.internet} name="internet_hours_daily" type="number" value={form.internet_hours_daily} onChange={handleChange} /></Grid>
                    <Grid item xs={6} display="flex"><TextField fullWidth size="small" className="q-input" label={t.labels.clothes} name="new_clothes_monthly" type="number" value={form.new_clothes_monthly} onChange={handleChange} /></Grid>
                    <Grid item xs={6} display="flex"><TextField fullWidth size="small" className="q-input" label={t.labels.bill} name="monthly_grocery_bill" type="number" value={form.monthly_grocery_bill} onChange={handleChange} /></Grid>
                </Grid>
            );
            default: return null;
        }
    };

    return (
        <div className="q-viewport">
            <Container maxWidth="sm">
                <Paper elevation={0} className="q-card">
                    {/* Dynamic Header */}
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        <Box sx={{ bgcolor: '#2e7d32', color: 'white', p: 1, borderRadius: 2, display: 'flex' }}><Co2 fontSize="large" /></Box>
                        <Box>
                            <Typography variant="h5" fontWeight="900" color="success.dark" sx={{ lineHeight: 1.1 }}>{t.title}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{t.subtitle}</Typography>
                        </Box>
                    </Stack>

                    <Stepper activeStep={activeStep} alternativeLabel className="q-stepper">
                        {t.steps.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={CustomStepIcon}>
                                    <Typography sx={{ fontSize: '0.65rem', fontWeight: '800' }}>{label}</Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <div className="q-render-area">
                        {loading ? (
                            <Box textAlign="center">
                                <CircularProgress color="success" size={50} />
                                <Typography sx={{ mt: 2, fontWeight: 700 }}>
                                    {t.loading}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#777' }}>
                                   {t.loading2}
                                </Typography>
                            </Box>
                        ) : result ? (
                            <Fade in timeout={500}>
                                <Box textAlign="center">
                                    <CheckCircle color="success" sx={{ fontSize: 70, mb: 1 }} />
                                    <Typography variant="h6" fontWeight="800">{t.finished}</Typography>
                                        <Typography variant="body2">{t.redirect}</Typography>
                                        <Typography variant="caption" sx={{ color: '#777' }}>
                                          {t.endml}
                                        </Typography>
                                </Box>
                            </Fade>
                        ) : (
                            <Fade in key={activeStep} timeout={400}>
                                <div style={{ width: '100%' }}>{renderStepContent(activeStep)}</div>
                            </Fade>
                        )}
                    </div>
                    {!result && !loading && (
                        <Box sx={{ mt: 4 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: '0.8rem',
                                    color: '#555',
                                    textAlign: 'center',
                                    m: 2,
                                    lineHeight: 1.5
                                }}
                            >
                                {t.buttonnote}
                                <span
                                    title={t.info}
                                    style={{ marginLeft: 6, cursor: 'help' }}
                                >
                                    ⓘ
                                </span>
                            </Typography>
                            <Box display="flex" justifyContent="space-between" mt={2}>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={() => setActiveStep(s => s - 1)}
                                    sx={{
                                        color: activeStep === 0 ? '#bbb' : '#666',
                                        fontWeight: 'bold'
                                    }}
                                    startIcon={<ArrowBack />}
                                >
                                    {t.back}
                                </Button>

                                <Button
                                    variant="contained"
                                    color="success"
                                    sx={{
                                        borderRadius: '14px',
                                        px: 2,
                                        fontWeight: '600',
                                        textTransform: 'none',
                                        boxShadow: '0 6px 14px rgba(46,125,50,0.35)',
                                        transition: '0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                    onClick={activeStep === 3 ? handleSubmit : () => setActiveStep(s => s + 1)}
                                >
                                    {activeStep === 3
                                        ? "See My Carbon Impact 🌍"   
                                        : `Continue →`  
                                    }
                                </Button>

                            </Box>
                        </Box>
                    )}
                </Paper>
            </Container>
        </div>
    );
};

export default Questionnaire;