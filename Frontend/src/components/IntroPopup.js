import React, { useState } from 'react';
import {
    Dialog, DialogContent, Typography, Button, Box,
    MobileStepper
} from '@mui/material';
import ForestRoundedIcon from '@mui/icons-material/ForestRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useLanguage } from './LangContext'; // ⭐

const translations = {
    en: {
        steps: [
            {
                label: "Welcome to CFT India 🌿",
                description: "You've just taken your first step toward a greener life."
            },
            {
                label: "Track your impact",
                description: "We analyze your lifestyle like travel, diet, and energy usage."
            },
            {
                label: "Improve sustainably",
                description: "Get smart suggestions to reduce your carbon footprint."
            }
        ],
        next: "Next",
        start: "Let's Start"
    },
    hi: {
        steps: [
            {
                label: "CFT India में आपका स्वागत है 🌿",
                description: "आपने हरित जीवन की ओर पहला कदम उठाया है।"
            },
            {
                label: "अपना प्रभाव ट्रैक करें",
                description: "हम आपकी जीवनशैली जैसे यात्रा, आहार और ऊर्जा का विश्लेषण करते हैं।"
            },
            {
                label: "सतत सुधार करें",
                description: "अपने कार्बन फुटप्रिंट को कम करने के लिए सुझाव प्राप्त करें।"
            }
        ],
        next: "आगे",
        start: "शुरू करें"
    }
};

const IntroPopup = ({ open, onClose, onStart }) => { // ⭐
    const [activeStep, setActiveStep] = useState(0);
    const { lang } = useLanguage();
    const t = translations[lang || 'en'];

    const icons = [
        <ForestRoundedIcon sx={{ fontSize: 60, color: '#1b5e20' }} />,
        <AnalyticsRoundedIcon sx={{ fontSize: 60, color: '#1b5e20' }} />,
        <CheckCircleRoundedIcon sx={{ fontSize: 60, color: '#1b5e20' }} />
    ];

    const handleNext = () => {
        if (activeStep === t.steps.length - 1) {
            onStart ? onStart() : onClose(); // ⭐
        } else {
            setActiveStep(prev => prev + 1);
        }
    };

    return (
        <Dialog open={open} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 4, p: 2, textAlign: 'center' } }}
        >
            <DialogContent>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                    {icons[activeStep]}
                </Box>

                <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: '#1b5e20' }}>
                    {t.steps[activeStep].label}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, minHeight: '60px' }}>
                    {t.steps[activeStep].description}
                </Typography>

                <MobileStepper
                    variant="dots"
                    steps={t.steps.length}
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
                        fontWeight: 700
                    }}
                >
                    {activeStep === t.steps.length - 1 ? t.start : t.next}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default IntroPopup;