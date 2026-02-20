import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container, Paper, Typography, Box, Button, Stack, TextField,
    Checkbox, FormControlLabel, Grid, Accordion, AccordionSummary,
    AccordionDetails, Alert, Radio, RadioGroup
} from '@mui/material';
import {
    ExpandMore, Restaurant, ElectricBolt,
    DirectionsCar, ShoppingBag, Home
} from '@mui/icons-material';
import ForestRoundedIcon from '@mui/icons-material/ForestRounded';
import { AuthContext } from "./AuthContext";

const Questionaire = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({});
    const [submitstatus, setSubmitstatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);

    const handleCheckbox = (category, activity, checked) => {
        setForm(prev => {
            const updated = { ...prev };
            if (!updated[category]) updated[category] = {};
            if (checked) updated[category][activity] = 0;
            else {
                delete updated[category][activity];
                if (Object.keys(updated[category]).length === 0) delete updated[category];
            }
            return updated;
        });
    };

    const handleQuantity = (category, activity, value) => {
        setForm(prev => {
            if (!prev[category] || !(activity in prev[category])) return prev;
            return {
                ...prev,
                [category]: { ...prev[category], [activity]: Number(value) }
            };
        });
    };

    const handleRadio = (category, activity) => {
        setForm(prev => ({
            ...prev,
            [category]: { [activity]: 0 }
        }));
    };

    const { token } = useContext(AuthContext);
  

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/questionaire`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(form)
            });
            // await response.json();
            const response2 = await fetch(`${process.env.REACT_APP_API_BASE_URL}/suggestionengine`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(form)
            });

            if (response.ok && response2.ok) {
                const suggestionData = await response2.json();
                localStorage.setItem('suggestion', JSON.stringify(suggestionData));
                setSubmitstatus({ type: 'success', message: 'Analysis Complete! Opening Dashboard...' });
                setTimeout(() => { navigate('/dashboard') }, 1200);
            } else {
                throw new Error("Calculation failed");
            }
        } catch (e) {
            setSubmitstatus({ type: 'error', message: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Paper elevation={4} sx={{ p: { xs: 2, md: 5 }, borderRadius: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <ForestRoundedIcon sx={{ fontSize: 60, color: '#2e7d32' }} />
                    <Typography variant="h3" sx={{ fontWeight: '800', color: '#1b5e20' }}>Carbon Footprint Application</Typography>
                    <Typography variant="body1" color="textSecondary">Some Question to start your  Journey and help us understand your environmental impact.</Typography>
                </Box>

                <form ref={formRef} onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {submitstatus && <Alert severity={submitstatus.type}>{submitstatus.message}</Alert>}

                        {/* FOOD CATEGORY */}
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Restaurant color="success" />
                                    <Typography variant="h6">Your Diet & Food Habits</Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    {[
                                        { id: "Rice", q: "Do you eat Rice?" },
                                        { id: "Wheat", q: "Do you eat Wheat (Chapatis/Bread)?" },
                                        { id: "Pulses", q: "Do you consume Pulses (Dal)?" },
                                        { id: "Eggs", q: "Do you include Eggs in your diet?" },
                                        { id: "Mutton", q: "Do you consume Mutton?" },
                                        { id: "Chicken", q: "Do you consume Chicken?" },
                                        { id: "Milk", q: "Do you use Milk?" },
                                        { id: "Vegetables Average", q: "Do you eat fresh Vegetables?" },
                                        { id: "Fruits Average", q: "Do you eat fresh Fruits?" }
                                    ].map(item => (
                                        <Grid item xs={12} sm={6} key={item.id}>
                                            <Stack spacing={1}>
                                                <FormControlLabel
                                                    control={<Checkbox color="success" onChange={e => handleCheckbox("Food", item.id, e.target.checked)} />}
                                                    label={item.q}
                                                />
                                                <TextField
                                                    fullWidth size="small" type="number"
                                                    label={item.id === "Milk" ? "How many litres per month?" : "How many kilograms per month?"}
                                                    disabled={!form["Food"]?.[item.id] && form["Food"]?.[item.id] !== 0}
                                                    onChange={e => handleQuantity("Food", item.id, e.target.value)}
                                                />
                                            </Stack>
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        {/* TRANSPORT */}
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <DirectionsCar color="success" />
                                    <Typography variant="h6">Travel & Transportation</Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    {[
                                        { id: "Petrol Fuel", q: "Do you drive a Petrol vehicle?", u: "Litres used per month?" },
                                        { id: "Diesel Fuel", q: "Do you drive a Diesel vehicle?", u: "Litres used per month?" },
                                        { id: "CNG Fuel", q: "Do you drive a CNG vehicle?", u: "Kilograms used per month?" },
                                        { id: "Train Travel", q: "Do you travel by Train?", u: "Total Kilometres per month?" },
                                        { id: "Domestic Flight", q: "Do you take Domestic Flights?", u: "Total Kilometres per year?" },
                                        { id: "Metro Rail", q: "Do you commute via Metro?", u: "Total Kilometres per month?" },
                                        { id: "Auto Rickshaw", q: "Do you use Auto Rickshaws?", u: "Total Kilometres per month?" }
                                    ].map(mode => (
                                        <Grid item xs={12} sm={6} key={mode.id}>
                                            <FormControlLabel
                                                control={<Checkbox color="success" onChange={e => handleCheckbox("Transport", mode.id, e.target.checked)} />}
                                                label={mode.q}
                                            />
                                            <TextField
                                                fullWidth size="small" type="number" label={mode.u}
                                                disabled={!form["Transport"]?.[mode.id] && form["Transport"]?.[mode.id] !== 0}
                                                onChange={e => handleQuantity("Transport", mode.id, e.target.value)}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        {/* SHOPPING */}
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <ShoppingBag color="success" />
                                    <Typography variant="h6">Shopping & Lifestyle</Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    {[
                                        { id: "Clothing", q: "Did you buy new Clothes?", u: "Total spent (₹) this month?" },
                                        { id: "Electronics", q: "Did you buy Electronics?", u: "Total spent (₹) this month?" },
                                        { id: "Furniture", q: "Did you buy Furniture?", u: "Total spent (₹) this month?" },
                                        { id: "Online Delivery", q: "Do you order items online?", u: "Number of deliveries per month?" }
                                    ].map(item => (
                                        <Grid item xs={12} sm={6} key={item.id}>
                                            <FormControlLabel
                                                control={<Checkbox color="success" onChange={e => handleCheckbox("Goods", item.id, e.target.checked)} />}
                                                label={item.q}
                                            />
                                            <TextField
                                                fullWidth size="small" type="number" label={item.u}
                                                disabled={!form["Goods"]?.[item.id] && form["Goods"]?.[item.id] !== 0}
                                                onChange={e => handleQuantity("Goods", item.id, e.target.value)}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        {/* ELECTRICITY */}
                        <Paper variant="outlined" sx={{ p: 3, border: '2px solid #a5d6a7' }}>
                            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                <ElectricBolt sx={{ color: '#2e7d32' }} />
                                <Typography variant="h6">Home Energy</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ mb: 2 }}>Based on your last utility bill, how much electricity did your home consume?</Typography>
                            <TextField
                                fullWidth label="Total Units (kWh) consumed this month" type="number"
                                onChange={e => setForm(prev => ({ ...prev, Electricity: { "Electricity Consumption": Number(e.target.value) } }))}
                            />
                        </Paper>

                        {/* HOUSING */}
                        <Paper variant="outlined" sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                <Home color="success" />
                                <Typography variant="h6">Housing & Construction</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ mb: 2 }}>Have you performed any construction or renovation work this year?</Typography>
                            <RadioGroup name="housing" onChange={e => handleRadio("Housing", e.target.value)}>
                                <Grid container spacing={1}>
                                    {[
                                        { id: "No Construction", l: "No, no work done" },
                                        { id: "Minor Repair", l: "Yes, minor repairs" },
                                        { id: "Moderate Renovation", l: "Yes, moderate renovation" },
                                        { id: "Major Renovation", l: "Yes, major renovation" },
                                        { id: "New Construction (Heavy)", l: "Yes, heavy new construction" }
                                    ].map(item => (
                                        <Grid item xs={12} sm={6} key={item.id}>
                                            <FormControlLabel value={item.id} control={<Radio color="success" />} label={item.l} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </RadioGroup>
                        </Paper>

                        <Button
                            type="submit" fullWidth variant="contained" size="large" disabled={loading}
                            sx={{ bgcolor: '#2e7d32', py: 2, fontWeight: 'bold', '&:hover': { bgcolor: '#1b5e20' } }}
                        >
                            {loading ? "Analyzing your lifestyle..." : "Calculate My Carbon Footprint"}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default Questionaire;