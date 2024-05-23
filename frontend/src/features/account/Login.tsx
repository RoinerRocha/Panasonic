import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../app/api/api';
import { FieldValues, useForm } from 'react-hook-form';

export default function Login() {
  const {register, handleSubmit, formState: {isSubmitting, errors, isValid}} = useForm({
    mode: 'onTouched'
  })

  // async function submitForm(data: FieldValues) {
  //   await api.Account.login(data);
  // }
  const onSubmit = async (data: FieldValues) => {
    try {
      await api.Account.login(data);
      toast.success('¡Inicio de sesión exitoso!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
      <Container component={Paper} maxWidth="sm" 
            sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', p:4}}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Inicio de sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Nombre de Usuario"
              autoFocus
              {...register('nombre_usuario', {required: 'Se necesita el usuario'})}
              error={!!errors.nombre_usuario}
              helperText={errors?.nombre_usuario?.message as string}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Contraseña"
              type="password"
              {...register('contrasena', {required: 'Se necesita la contraseña'})}
              error={!!errors.contrasena}
              helperText={errors?.contrasena?.message as string}
            />
            <LoadingButton loading={isSubmitting}
              disabled={!isValid}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
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