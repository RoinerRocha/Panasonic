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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../store/configureStore";
import * as React from "react";
import AppBar from "@mui/material/AppBar"; // Usa AppBar en lugar de MuiAppBar
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

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
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
    { title: t('menu-historial'), path: "/history" },
    { title: t('menu-zonas'), path: "/zonas" },
    { title: t('menu-usuarios'), path: "/users" },
    { title: t('menu-cuentas-contables'), path: "/NewAccount" },
    { title: t('menu-estado-activos'), path: "/NewStatusAssets" },
    { title: t('menu-accesos'), path: "/Access" },
    { title: t('menu-perfiles'), path: "/NewProfiles" },
    { title: t('menu-lista-activos'), path: "/NewAsset" },
    { title: t('menu-baja-activos'), path: "/RetirementList" },
    { title: t('menu-venta-activos'), path: "/AssetSalesList" },
    { title: t('menu-depreciacion-activos'), path: "/NewServiceLife" },
    { title: t('menu-Mapas'), path: "/Maps" },
    { title: t('menu-ayuda'), path: "/" }, // Manual
  ];

  // Filtrar enlaces en función del perfil del usuario
  const filteredMidLinks = user?.perfil_asignado === "Maestro"
    ? midLinks
    : midLinks.filter(link =>
        link.title === t('menu-historial') ||
        link.title === t('menu-Mapas') 
  ).concat([
      { title: t('menu-ingreso-activos'), path: "/RegisterAsset" },
      { title: t('menu-lista-ventas'), path: "/AssetSales" },
      { title: t('menu-lista-bajas'), path: "/AssetRetirement" },
      { title: t('menu-ayuda'), path: "/" }
  ]);

  return (
    <Box>
      <AppBarStyled position="static" sx={{ mb: 4 }} open={open}>
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
            <FormControl
              variant="outlined"
              size="small"
              sx={{
                minWidth: 100,
                ml: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "transparent", // Sin fondo
                  color: (theme) => theme.palette.text.secondary, // Texto en color text.secondary
                  "& fieldset": {
                    borderColor: "white", // Borde blanco
                  },
                  "&:hover fieldset": {
                    borderColor: "white", // Borde blanco al pasar el ratón
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white", // Borde blanco cuando está enfocado
                  },
                },
                "& .MuiSvgIcon-root": {
                  color: (theme) => theme.palette.text.secondary, // Ícono en color text.secondary
                },
              }}
            >
              <InputLabel
                id="language-select-label"
                sx={{ color: (theme) => theme.palette.text.secondary }} // Etiqueta en color text.secondary
              >
                {t('select_language')}
              </InputLabel>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={language}
                onChange={(event) => changeLanguage(event.target.value)}
                label={t('language')}
              >
                <MenuItem value="en" sx={{ color: (theme) => theme.palette.text.secondary }}>
                  {t('english')}
                </MenuItem>
                <MenuItem value="es" sx={{ color: (theme) => theme.palette.text.secondary }}>
                  {t('spanish')}
                </MenuItem>
              </Select>
            </FormControl>
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
      </AppBarStyled>
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
                  {(() => {
                    switch (title) {
                      case t("menu-dashboard"):
                        return <HomeIcon />;
                      case t("menu-usuarios"):
                        return <PeopleAltIcon />;
                      case t("menu-historial"):
                        return <HistoryIcon />;
                      case t("menu-zonas"):
                        return <MediationIcon />;
                      case t("menu-cuentas-contables"):
                        return <AccountBalanceIcon />;
                      case t("menu-estado-activos"):
                        return <AssessmentIcon />;
                      case t("menu-accesos"):
                        return <KeyIcon />;
                      case t("menu-perfiles"):
                        return <AccountCircleIcon />;
                      case t("menu-lista-activos"):
                        return <FormatListNumberedIcon />;
                      case t("menu-ingreso-activos"):
                        return <AddCircleIcon />;
                      case t("menu-baja-activos"):
                        return <RuleFolderIcon />;
                      case t("menu-venta-activos"):
                        return <MonetizationOnIcon />;
                      case t("menu-reportes"):
                        return <SummarizeIcon />;
                      case t("menu-depreciacion-mensual"):
                        return <CalendarMonthIcon />;
                      case t("menu-depreciacion-activos"):
                        return <FactCheckIcon />;
                      case t("menu-Mapas"):
                        return <MyLocationIcon />;
                      case t("menu-ayuda"):
                        return <HelpIcon />;
                      default:
                        return null;
                    }
                  })()}
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
