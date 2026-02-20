import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import {
    AppBar, Toolbar, Typography, Button, Box, Avatar, Tooltip
} from '@mui/material';
import {  ExitToApp, Dashboard as DashboardIcon, Assignment } from '@mui/icons-material';
import ForestRoundedIcon from '@mui/icons-material/ForestRounded';
const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Only show the header if a user is logged in
    if (!user) return null;

    return (
        <AppBar position="sticky" sx={{ bgcolor: '#2e7d32', mb: 4 }}>
            <Toolbar>
                {/* Logo and Branding */}
                <ForestRoundedIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                <Typography
                    variant="h6"
                    noWrap
                    component={Link}
                    to="/"
                    sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontWeight: 700,
                        color: 'inherit',
                        textDecoration: 'none',
                        flexGrow: 0,
                    }}
                >
                    CFT India
                </Typography>

                {/* Desktop Navigation Links */}
                <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                    <Button
                        component={Link}
                        to="/dashboard"
                        startIcon={<DashboardIcon />}
                        sx={{ color: 'white' }}
                    >
                        Dashboard
                    </Button>
                    <Button
                        component={Link}
                        to="/"
                        startIcon={<Assignment />}
                        sx={{ color: 'white' }}
                    >
                        Survey
                    </Button>
                </Box>

                {/* User Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        Hi, <strong>{user}</strong>
                    </Typography>

                    <Tooltip title="User Profile">
                        <Avatar sx={{ bgcolor: '#81c784', width: 32, height: 32 }}>
                            {user.charAt(0).toUpperCase()}
                        </Avatar>
                    </Tooltip>

                    <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        onClick={handleLogout}
                        startIcon={<ExitToApp />}
                        sx={{
                            borderColor: 'rgba(255,255,255,0.5)',
                            '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;