import React, { useContext, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import {
    AppBar, Toolbar, Typography, Button, Box, Avatar, Tooltip,
    Stack, useTheme, useMediaQuery, Paper, BottomNavigation, BottomNavigationAction
} from '@mui/material';
import {
    ExitToApp,
    Dashboard as DashboardIcon,
    Assignment,
    Translate as TranslateIcon,
    Home as HomeIcon
} from '@mui/icons-material';
import ForestRoundedIcon from '@mui/icons-material/ForestRounded';
import { useLanguage } from './LangContext';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { lang, toggleLanguage } = useLanguage();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* --- TOP APP BAR --- */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: '#1b5e20',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    zIndex: theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 } }}>

                    {/* 1. Brand Logo */}
                    <Stack direction="row" alignItems="center" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
                        <ForestRoundedIcon sx={{ mr: 1, color: '#81c784' }} />
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                fontWeight: 900,
                                letterSpacing: -0.5,
                                fontSize: { xs: '1.1rem', sm: '1.25rem' }
                            }}
                        >
                            CFT India
                        </Typography>
                    </Stack>

                    {/* 2. Central Navigation (Desktop Only) */}
                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                component={Link}
                                to="/dashboard"
                                startIcon={<DashboardIcon />}
                                sx={{
                                    color: 'white',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    bgcolor: isActive('/dashboard') ? 'rgba(255,255,255,0.15)' : 'transparent',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                                }}
                            >
                                Dashboard
                            </Button>
                            <Button
                                component={Link}
                                to="/"
                                startIcon={<Assignment />}
                                sx={{
                                    color: 'white',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    bgcolor: isActive('/') ? 'rgba(255,255,255,0.15)' : 'transparent',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                                }}
                            >
                                Survey
                            </Button>
                        </Box>
                    )}

                    {/* 3. Right Side: Lang & User */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>

                        {/* Language Switcher - Compact on Mobile */}
                        <Stack direction="row" alignItems="center" sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 0.4, borderRadius: 2 }}>
                            <Button
                                size="small"
                                onClick={() => toggleLanguage(lang === 'en' ? 'hi' : 'en')}
                                sx={{
                                    minWidth: { xs: 35, sm: 45 },
                                    height: 24,
                                    fontSize: '0.65rem',
                                    color: 'white',
                                    fontWeight: 800,
                                    textTransform: 'none',
                                }}
                            >
                                <TranslateIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                {lang.toUpperCase()}
                            </Button>
                        </Stack>

                        <Avatar
                            sx={{
                                bgcolor: '#4caf50',
                                width: 30,
                                height: 30,
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                border: '2px solid rgba(255,255,255,0.3)',
                                display: { xs: 'none', sm: 'flex' } // Hide avatar on very small screens to save space
                            }}
                        >
                            {user.charAt(0).toUpperCase()}
                        </Avatar>

                        <Tooltip title="Logout">
                            <Button
                                onClick={handleLogout}
                                sx={{
                                    minWidth: 'auto',
                                    p: 0.8,
                                    color: 'white',
                                    borderRadius: 1.5,
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    '&:hover': { bgcolor: '#c62828' }
                                }}
                            >
                                <ExitToApp sx={{ fontSize: 18 }} />
                            </Button>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* --- BOTTOM NAVIGATION (Mobile Only) --- */}
            {isMobile && (
                <Paper
                    sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, borderTop: '1px solid #e0e0e0' }}
                    elevation={3}
                >
                    <BottomNavigation
                        showLabels
                        value={location.pathname}
                        onChange={(event, newValue) => {
                            navigate(newValue);
                        }}
                        sx={{
                            '& .Mui-selected': {
                                color: '#1b5e20 !important',
                                '& .MuiSvgIcon-root': { color: '#1b5e20' }
                            }
                        }}
                    >
                        <BottomNavigationAction
                            label="Survey"
                            value="/"
                            icon={<Assignment />}
                        />
                        <BottomNavigationAction
                            label="Dashboard"
                            value="/dashboard"
                            icon={<DashboardIcon />}
                        />
                    </BottomNavigation>
                    {/* Add a safe area spacer for newer iPhones */}
                    <Box sx={{ height: 'env(safe-area-inset-bottom)', bgcolor: 'white' }} />
                </Paper>
            )}

            {/* Spacer for Bottom Nav so content isn't hidden behind it on mobile */}
            {isMobile && <Box sx={{ height: 70 }} />}
        </>
    );
};

export default Header;