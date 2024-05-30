import { Button, Menu, Fade, MenuItem } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { signOut } from "../../features/account/accountSlice";
import { Link } from 'react-router-dom';

export default function SignInMenu() {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.account);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log('nombre de usuario:', user?.nombre_usuario);
  return (
    <div>
      <Button
        color='inherit' 
        onClick={handleClick}
        sx={{typography: 'h6'}}
      >
        {user?.nombre_usuario}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>Perfil</MenuItem>
        <MenuItem onClick={handleClose}>Editar</MenuItem>
        <MenuItem component={Link} to="/users" onClick={handleClose}>Registro</MenuItem>
        <MenuItem onClick={() =>dispatch(signOut())}>Cerrar sesión</MenuItem>
      </Menu>
    </div>
  );
}