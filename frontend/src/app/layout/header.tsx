import { styled, useTheme } from '@mui/material/styles';
import { Lock, Login } from "@mui/icons-material";
import 
    { Badge, Box, Drawer, Divider, IconButton, List, 
        ListItem, ListItemButton, ListItemText, Switch, Toolbar,
         Typography } 
        from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../store/configureStore";
import * as React from 'react';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemIcon from '@mui/material/ListItemIcon';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import SignInMenu from "./SigninMenu";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
    })<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const midLinks = [
    {title: 'Activos', path: '/'},
    {title: 'historial', path: '/register'},
    {title: 'Zonas', path: '/zonas'},
    {title: 'Usuarios', path: '/users'},
    {title: 'Cuentas Contables', path: '/NewAccount'},

]

const rightLinks = [
    {title: 'Iniciar sesión', path: '/login'},
]

const navStyles = {
    color: 'inherit',
    textDecoration: 'none', 
    typography: 'h6',
    '&:hover': {
        color: 'grey.500'
    },
    '&.active': {
        color: 'text.secondary'
    }
}

interface Props {
    darkMode: boolean;
    handleThemeChange: ()=> void;
}

export default function Header({darkMode, handleThemeChange}: Props) {
    const {user} = useAppSelector(state => state.account);

    const theme = useTheme();
    
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
      };
    
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box>
            <AppBar position='static' sx={{mb: 4}} open={open}>
                <Toolbar sx={{display: 'flex', justifyContent:'space-between', alignItems: 'center'}}>
                    <Box display='flex' alignItems='center'>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                        <Typography variant="h4" component={NavLink} 
                            to='/' 
                            sx={navStyles}>
                            Panasonic
                        </Typography>
                        <Switch checked={darkMode} onChange={handleThemeChange}/>
                    </Box>
                    
                    <Box display='flex' alignItems='center'>
                        <IconButton size='large' edge='start' color='inherit' sx={{mr: 2}}>
                            <Badge color="secondary">
                                <Lock />
                            </Badge>
                        </IconButton>

                        {user ? (
                            <SignInMenu />
                        ) : (
                            <List sx={{display: 'flex'}}>
                                {rightLinks.map(({title, path}) => 
                                    <ListItem 
                                        component={NavLink}
                                        to={path}
                                        key={path}
                                        sx={navStyles}
                                    >
                                        {title.toUpperCase()}
                                    </ListItem>
                                )}
                            </List>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                {midLinks.map(({ title, path }) => (
                    <ListItem key={path} disablePadding>
                    <ListItemButton component={NavLink} to={path} sx={navStyles}>
                        <ListItemIcon>
                        {title === 'Iniciar sesión' ? <Login /> : <InboxIcon />}
                        </ListItemIcon>
                        <ListItemText primary={title} />
                    </ListItemButton>
                    </ListItem>
                ))}
                </List>
                <Divider />
            </Drawer>
        </Box>
    )
}