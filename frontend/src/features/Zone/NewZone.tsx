import {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import api from '../../app/api/api';
import { toast } from 'react-toastify';

export default function NewZone() {
  const navigate = useNavigate();

  const { register, handleSubmit, setError, formState: { isSubmitting, errors, isValid, isSubmitSuccessful } } = useForm({
    mode: 'onTouched'
  });

  function handleApiErrors(errors: any) {
    if (Array.isArray(errors)) { // Verifica si errors es un array
      errors.forEach((error: string) => { // Ahora puedes llamar al método forEach()
        if(error.includes('numeroZona')) {
          setError('numeroZona', { message: error });
        } else if (error.includes('nombreZona')) {
          setError('nombreZona', { message: error });
        }
      });
    }
  }
  

  const onSubmit = async (data: FieldValues) => {
    try {
      // Llama a la API para registrar la zona
      const response = await api.Zones.saveZona(data);
      console.log(response.data); // Manejar la respuesta del backend según sea necesario
      navigate('/zonas');
      toast.success('Zona Registrada con exito'); // Redirigir al usuario a la página de inicio después de registrar la zona
    } catch (error) {
      handleApiErrors(errors);
      console.error('Error:', error);
      // Manejar errores de registro aquí
    }
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });


  return (
    <Container component={Paper} maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Nueva Zona
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          fullWidth
          label="Numero de Zona"
          autoFocus
          {...register('numeroZona', { required: 'Se necesita el numero de la zona' })}
          error={!!errors.numeroZona}
          helperText={errors?.numeroZona?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Nombre de la Zona"
          {...register('nombreZona', { required: 'Se necesita el nombre de la Zona' })}
          error={!!errors.nombreZona}
          helperText={errors?.nombreZona?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Nombre del responsable"
          {...register('responsableAreaNom_user', { required: 'Se necesita el nombre del responsable' })}
          error={!!errors.responsableAreaNom_user}
          helperText={errors?.responsableAreaNom_user?.message as string}
        />
        <LoadingButton
          loading={isSubmitting}
          disabled={!isValid}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Crear Zona
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to="/">
              {"Volver"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
