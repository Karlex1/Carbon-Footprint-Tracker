import React, { useState } from 'react';
import {
    Dialog, DialogContent, Typography, Button, Box,
     MobileStepper
} from '@mui/material';
import ForestRoundedIcon from '@mui/icons-material/ForestRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const IntroPopup = ({ open, onClose }) => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            label: "Welcome to CFT India 🌿",
            description: "You've just taken your first step toward a greener life. CFT stands for Carbon Footprint Tracker.",
            icon: <ForestRoundedIcon sx={{ fontSize: 60, color: '#1b5e20' }} />
        },
        {
            label: "What is this initiative?",
            description: "We help Indians understand how their daily habits—like travel, diet, and electricity—impact our environment.",
            icon: <AnalyticsRoundedIcon sx={{ fontSize: 60, color: '#1b5e20' }} />
        },
        {
            label: "How it works?",
            description: "1. Take a quick monthly survey. 2. See your emission score. 3. Get personalized tips to reduce your footprint.",
            icon: <CheckCircleRoundedIcon sx={{ fontSize: 60, color: '#1b5e20' }} />
        }
    ];

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            onClose();
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    return (
        <Dialog
            open={open}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4, p: 2, textAlign: 'center' } }}
        >
            <DialogContent>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                    {steps[activeStep].icon}
                </Box>

                <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: '#1b5e20' }}>
                    {steps[activeStep].label}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, minHeight: '60px' }}>
                    {steps[activeStep].description}
                </Typography>

                <MobileStepper
                    variant="dots"
                    steps={steps.length}
                    position="static"
                    activeStep={activeStep}
                    sx={{ justifyContent: 'center', bgcolor: 'transparent', mb: 2 }}
                    nextButton={null}
                    backButton={null}
                />

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleNext}
                    sx={{
                        bgcolor: '#1b5e20',
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#144d18' }
                    }}
                >
                    {activeStep === steps.length - 1 ? "Let's Start!" : "Next"}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default IntroPopup;