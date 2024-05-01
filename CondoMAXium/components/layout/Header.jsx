import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Box,
    Container,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import supabase from '../../config/supabaseClient'; // Ensure the correct path

const Header = () => {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('roleOfUser')
                    .eq('emailProfile', user.email)
                    .single();
                setRole(profile.roleOfUser);
            }
        };

        fetchRole();
    }, []);

    const handleOpenNavMenu = (event) => {
        console.log('Opening menu...');
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseMenu = () => {
        console.log('Closing menu...');
        setAnchorElNav(null);
    };

    const handleMenuItemClick = () => {
        handleCloseMenu();
        if (role === 'owner') {
            window.location.href = '/dashboard';
        } else if (role === 'cmc') {
            window.location.href = '/dashboardCMC';
        } else {
            window.location.href = '/dashboard'; // Default navigation
        }
    };

    return (
        <AppBar position="static" sx={{ flexGrow: 1, marginBottom: "25px" }}>
            <Container maxWidth="xl" sx={{ paddingX: 0 }}>
                <Toolbar disableGutters>
                    <Typography
                        variant="h4"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            flexGrow: 1,
                            fontFamily: "Arial",
                            fontWeight: 700,
                            color: "inherit",
                            textDecoration: "none",
                            marginTop: "-15px",
                            alignSelf: "center",
                        }}
                    >
                        CondoMAXium
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box>
                        <IconButton
                            size="large"
                            aria-label="menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseMenu}
                        >
                            <MenuItem onClick={handleMenuItemClick}>Dashboard</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
