import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../../app/api/api';

export default function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (event: any) => {
    event.preventDefault();
    api.Account.login(values);
  };

  function handleInputChange(event: any) {
    const {name, value} = event.target;
    setValues({...values, [name]: value});
  }

  return (
      <Container component={Paper} maxWidth="sm" 
            sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', p:4}}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Inicio de sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo"
              name="email"
              autoFocus
              onChange={handleInputChange}
              value={values.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              onChange={handleInputChange}
              value={values.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/">
                  Recupera tu contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register">
                  {"No tienes una cuenta? regístrate"}
                </Link>
              </Grid>
            </Grid>
          </Box>
      </Container>
  );
}