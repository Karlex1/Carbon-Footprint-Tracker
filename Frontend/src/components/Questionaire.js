import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, Typography, Grid, TextField, MenuItem,
    Button, Checkbox, FormControlLabel, Box, CircularProgress,
    InputAdornment, Stepper, Step, StepLabel, Fade, Divider
} from "@mui/material";
import {
    CheckCircle, ArrowForward, ArrowBack, Co2
} from "@mui/icons-material";

const steps = ['Profile', 'Travel', 'Lifestyle', 'Digital'];

const Questionaire = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        body_type: 'normal', gender: 'male', diet_type: 'vegetarian',
        transport_mode: 'public', vehicle_fuel_type: 'petrol',
        air_travel_frequency: 'never', vehicle_distance_km: 50,
        waste_bag_count: 2, waste_bag_size: 'medium', energy_efficiency_level: 'No',
        monthly_grocery_bill: 2000, tv_pc_hours_daily: 4,
        new_clothes_monthly: 1, internet_hours_daily: 3,
        social_activity_level: 'sometimes',
        recycling_items: [], cooking_methods: []
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleCheckChange = (listName, item) => {
        const current = form[listName];
        const updated = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
        setForm({ ...form, [listName]: updated });
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Session Expired please login first...")
            navigate('/login')
            return;
        }
        setLoading(true);
        const payload = {
    ...form,
    // Explicitly converting strings to numbers for the ML model
    vehicle_distance_km: Number(form.vehicle_distance_km),
    waste_bag_count: Number(form.waste_bag_count),
    monthly_grocery_bill: Number(form.monthly_grocery_bill),
    tv_pc_hours_daily: Number(form.tv_pc_hours_daily),
    internet_hours_daily: Number(form.internet_hours_daily),
    new_clothes_monthly: Number(form.new_clothes_monthly),
    
    // Derived values
    recycling_count: form.recycling_items.length,
    cooking_count: form.cooking_methods.length || 1,
};

// Remove the arrays so they aren't in the JSON
delete payload.recycling_items;
delete payload.cooking_methods;
        delete payload.recycling_items;
        delete payload.cooking_methods;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL }/questionaire`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                setResult(data);
                setTimeout(() => navigate('/dashboard'), 2500);
            }
        } catch (err) { alert("Server Error"); }
        finally { setLoading(false); }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0: return (
                <Grid container spacing={3} justifyContent={'center'}>
                    <Grid item xs={12} sm={4}><TextField select fullWidth label="Body Type" name="body_type" value={form.body_type} onChange={handleChange}>{['underweight', 'normal', 'overweight', 'obese'].map(v => <MenuItem key={v} value={v}>{v.toUpperCase()}</MenuItem>)}</TextField></Grid>
                    <Grid item xs={12} sm={4}><TextField select fullWidth label="Gender" name="gender" value={form.gender} onChange={handleChange}><MenuItem value="male">Male</MenuItem><MenuItem value="female">Female</MenuItem></TextField></Grid>
                    <Grid item xs={12} sm={4}><TextField select fullWidth label="Diet" name="diet_type" value={form.diet_type} onChange={handleChange}>{['vegetarian', 'vegan', 'omnivore', 'pescatarian'].map(v => <MenuItem key={v} value={v}>{v.toUpperCase()}</MenuItem>)}</TextField></Grid>
                </Grid>
            );
            case 1: return (
                <Grid container spacing={3} justifyContent={'center'}>
                    <Grid item xs={12} sm={6}>
                        <TextField select fullWidth label="Mode" name="transport_mode" value={form.transport_mode} onChange={handleChange}>
                            <MenuItem value="public">Public</MenuItem>
                            <MenuItem value="private">Private</MenuItem><MenuItem value="walk/bicycle">Walk/Bicycle</MenuItem></TextField></Grid>
                    <Grid item xs={12} sm={6}><TextField select fullWidth label="Fuel" name="vehicle_fuel_type" value={form.vehicle_fuel_type} onChange={handleChange}>{['petrol', 'diesel', 'electric', 'cng'].map(v => <MenuItem key={v} value={v}>{v.toUpperCase()}</MenuItem>)}</TextField></Grid>
                    <Grid item xs={12} sm={6}><TextField sx={{width:'140px'}} type="number" label="Distance" name="vehicle_distance_km" value={form.vehicle_distance_km} onChange={handleChange} InputProps={{ endAdornment: <InputAdornment position="end">km/mo</InputAdornment> }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField select fullWidth label="Flights" name="air_travel_frequency" value={form.air_travel_frequency} onChange={handleChange}>{['never', 'rarely', 'frequently', 'very frequently'].map(v => <MenuItem key={v} value={v}>{v.toUpperCase()}</MenuItem>)}</TextField></Grid>
                </Grid>
            );
            case 2: return (
                <Grid container spacing={3} justifyContent={'center'}>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth type="number" label="Weekly Bags" name="waste_bag_count" value={form.waste_bag_count} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth label="Size" name="waste_bag_size" value={form.waste_bag_size} onChange={handleChange}>
                            {['small', 'medium', 'large', 'extra large'].map(v => <MenuItem key={v} value={v}>{v.toUpperCase()}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth label="Energy Efficient" name="energy_efficiency_level" value={form.energy_efficiency_level} onChange={handleChange}>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                            <MenuItem value="Sometimes">Sometimes</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Recycling Habits</Typography>
                        {['Paper', 'Plastic', 'Glass', 'Metal'].map(item => <FormControlLabel key={item} control={<Checkbox size="small" color="success" onChange={() => handleCheckChange('recycling_items', item)} />} label={item} checked={form.recycling_items.includes(item)} />)}
                        
                        </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Cooking Habits</Typography>
                        {['Stove', 'Oven', 'Microwave', 'Grill'].map(item => <FormControlLabel key={item} control={<Checkbox size="small" color="success" onChange={() => handleCheckChange('cooking_methods', item)} />} label={item} checked={form.cooking_methods.includes(item)} />)}
                        
                        </Grid>
                </Grid>
            );
            case 3: return (
                <Grid container spacing={3} justifyContent={'center'}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Grocery Bill" name="monthly_grocery_bill" type="number" value={form.monthly_grocery_bill} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField select fullWidth label="Social Habits" name="social_activity_level" value={form.social_activity_level} onChange={handleChange}><MenuItem value="never">Never</MenuItem><MenuItem value="sometimes">Sometimes</MenuItem><MenuItem value="often">Often</MenuItem></TextField></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Screen Time" name="tv_pc_hours_daily" type="number" value={form.tv_pc_hours_daily} onChange={handleChange} InputProps={{ endAdornment: <InputAdornment position="end">hrs</InputAdornment> }} /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Internet" name="internet_hours_daily" type="number" value={form.internet_hours_daily} onChange={handleChange} InputProps={{ endAdornment: <InputAdornment position="end">hrs</InputAdornment> }} /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="New Clothes" name="new_clothes_monthly" type="number" value={form.new_clothes_monthly} onChange={handleChange} InputProps={{ endAdornment: <InputAdornment position="end">pcs</InputAdornment> }} /></Grid>
                </Grid>
            );
            default: return null;
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #f6f0f0 50%, #c3cfe2 100%)', py: 2}}>
            <Container maxWidth="md">
                <Paper elevation={10} sx={{ p: 4, borderRadius: 8, backdropFilter: 'blur(10px)', bgcolor: 'rgba(255, 255, 255, 0.9)', textAlign: 'center' }}>

                    <Co2 color="success" sx={{ fontSize: 60, mb: 1 }} />
                    <Typography variant="h4" fontWeight="900" color="success.dark">Footprint Calculator</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>Accurate Carbon Analysis for India</Typography>

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
                        {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                    </Stepper>

                    {result ? (
                        <Fade in={!!result}>
                            <Box py={4}>
                                <CheckCircle color="success" sx={{ fontSize: 80, mb: 2 }} />
                                <Typography variant="h5" fontWeight="800" gutterBottom>Calculation Finished!</Typography>
                                <Typography variant="body1">Yearly: <b>{result.yearly_totalemission} kg</b></Typography>
                                <Typography variant="body2" color="textSecondary">Redirecting to Dashboard...</Typography>
                            </Box>
                        </Fade>
                    ) : (
                        <Box >
                            {renderStepContent(activeStep)}
                            <Divider sx={{ my: 4 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ArrowBack />}>Back</Button>
                                {activeStep === steps.length - 1 ? (
                                    <Button variant="contained" color="success" onClick={handleSubmit} disabled={loading} sx={{ px: 4, borderRadius: 4 }}>
                                        {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                                    </Button>
                                ) : (
                                    <Button variant="contained" color="success" onClick={handleNext} endIcon={<ArrowForward />} sx={{ px: 4, borderRadius: 4 }}>Next</Button>
                                )}
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default Questionaire;
