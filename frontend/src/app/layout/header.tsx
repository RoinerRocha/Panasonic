import { Lock, Login } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../store/configureStore";
import SignInMenu from "./SigninMenu";

const midLinks = [
    {title: 'Activos', path: '/'},
    {title: 'historial', path: '/register'},
    {title: 'Formularios', path: '/'},
]
const rightLinks = [
    {title: 'Inicio', path: '/login'},
    {title: 'Registro', path: '/register'},
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

    return (
        <AppBar position='static' sx={{mb: 4}}>
            <Toolbar sx={{display: 'flex', justifyContent:'space-between', alignItems: 'center'}}>

                <Box display='flex' alignItems='center'>
                    <Typography variant="h4" component={NavLink} 
                        to='/' 
                        sx={navStyles}>
                        Panasonic
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange}/>
                </Box>
                <List sx={{display: 'flex'}}>
                    {midLinks.map(({title, path}) => 
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

                <Box display='flex' alignItems='center'>
                    <IconButton size='large' edge='start' color='inherit' sx={{mr: 2}}>
                        <Badge badgeContent='4' color="secondary">
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
    )
}