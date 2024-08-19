import { styled, useTheme } from "@mui/material/styles";
import { Lock, Login } from "@mui/icons-material";
import {
  Badge,
  Box,
  Drawer,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Switch,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../store/configureStore";
import * as React from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HistoryIcon from '@mui/icons-material/History';
import MediationIcon from '@mui/icons-material/Mediation';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssessmentIcon from '@mui/icons-material/Assessment';
import KeyIcon from '@mui/icons-material/Key';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HelpIcon from '@mui/icons-material/Help';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HomeIcon from '@mui/icons-material/Home';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SignInMenu from "./SigninMenu";
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
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
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));



const navStyles = {
  color: "inherit",
  textDecoration: "none",
  typography: "h6",
  "&:hover": {
    color: "grey.500",
  },
  "&.active": {
    color: "text.secondary",
  },
};

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

export default function Header({ darkMode, handleThemeChange }: Props) {
  const { user } = useAppSelector((state) => state.account);

  const theme = useTheme();
  const { t } = useTranslation();
  const { changeLanguage, language } = useLanguage();

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(event.target.value);
  };

  const rightLinks = [{ title: t('titulo-login'), path: "/login" }];

  const midLinks = [
    { title: t('menu-dashboard'), path: "/" },
    { title: t('menu-historial'), path: "/" },
    { title: t('menu-zonas'), path: "/zonas" },
    { title: t('menu-usuarios'), path: "/users" },
    { title: t('menu-cuentas-contables'), path: "/NewAccount" },
    { title: t('menu-estado-activos'), path: "/NewStatusAssets" },
    { title: t('menu-accesos'), path: "/Access" },
    { title: t('menu-perfiles'), path: "/NewProfiles" },
    { title: t('menu-lista-activos'), path: "/NewAsset" },
    { title: t('menu-ingreso-activos'), path: "/RegisterAsset" },
    { title: t('menu-baja-activos'), path: "/AssetRetirement" },//frm
    { title: t('menu-venta-activos'), path: "/AssetSales" },//frm
    { title: t('menu-reportes'), path: "/" },
    { title: t('menu-depreciacion-mensual'), path: "/depreciation" },
    { title: t('menu-depreciacion-activos'), path: "/NewServiceLife" },
    { title: t('menu-Mapas'), path: "/Maps" },
    { title: t('menu-ayuda'), path: "/" }, // Manual
  ];

  // Filtrar enlaces en función del perfil del usuario
  const filteredMidLinks = user?.perfil_asignado === "Maestro"
    ? midLinks
    : midLinks.filter(link =>
        link.title === t('menu-ingreso-activos') || 
        link.title === t('menu-venta-activos') ||
        link.title === t('menu-reportes') ||
        link.title === t('menu-lista-activos') ||
        link.title === t('menu-baja-activos')
      );

  return (
    <Box>
      <AppBar position="static" sx={{ mb: 4 }} open={open}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box display="flex" alignItems="center">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
              disabled={!user}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" component={NavLink} to="/" sx={navStyles}>
              
              {t('titulo')}
            </Typography>
            <Switch checked={darkMode} onChange={handleThemeChange} />
            <select id="language-select" value={language} onChange={handleChangeLanguage}>
              <option value="en">{t('english')}</option>
              <option value="es">{t('spanish')}</option>
            </select>
          </Box>

          <Box display="flex" alignItems="center">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
            >
              <Badge color="secondary">
                <Lock />
              </Badge>
            </IconButton>

            {user ? (
              <SignInMenu />
            ) : (
              <List sx={{ display: "flex" }}>
                {rightLinks.map(({ title, path }) => (
                  <ListItem
                    component={NavLink}
                    to={path}
                    key={path}
                    sx={navStyles}
                  >
                    {title.toUpperCase()}
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {filteredMidLinks.map(({ title, path }) => (
            <ListItem key={path} disablePadding>
              <ListItemButton component={NavLink} to={path} sx={navStyles}>
                <ListItemIcon>
                  {title === t('menu-dashboard') && <HomeIcon />}
                  {title === t('menu-usuarios') && <PeopleAltIcon />}
                  {title === t('menu-historial') && <HistoryIcon />}
                  {title === t('menu-zonas') && <MediationIcon />}
                  {title === t('menu-cuentas-contables') && <AccountBalanceIcon />}
                  {title === t('menu-estado-activos') && <AssessmentIcon />}
                  {title === t('menu-accesos') && <KeyIcon />}
                  {title === t('menu-perfiles') && <AccountCircleIcon />}
                  {title === t('menu-lista-activos') && <FormatListNumberedIcon />}
                  {title === t('menu-ingreso-activos') && <AddCircleIcon />}
                  {title === t('menu-baja-activos') && <RuleFolderIcon />}
                  {title === t('menu-venta-activos') && <MonetizationOnIcon />}
                  {title === t('menu-reportes') && <SummarizeIcon />}
                  {title === t('menu-depreciacion-mensual') && <CalendarMonthIcon />}
                  {title === t('menu-depreciacion-activos') && <FactCheckIcon />}
                  {title === t('menu-Mapas') && <MyLocationIcon />}
                  {title === t('menu-ayuda') && <HelpIcon />}
                </ListItemIcon>
                <ListItemText primary={title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
    </Box>
  );
}
