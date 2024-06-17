import { useState, useEffect } from 'react';
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
import { Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import api from '../../app/api/api';
import { toast } from 'react-toastify';
import { profileModels } from '../../app/models/profileModels'; // Importar el modelo de perfil

export default function Register() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<profileModels[]>([]);

  const { register, handleSubmit, setError, formState: { isSubmitting, errors, isValid } } = useForm({
    mode: 'onTouched'
  });

  useEffect(() => {
    // Fetch profiles from the API
    const fetchProfiles = async () => {
      try {
        const profilesData = await api.profiles.getProfiles();
        console.log("Profiles data:", profilesData); // Verificar la respuesta de la API
        if (profilesData && Array.isArray(profilesData.data)) {
          setProfiles(profilesData.data);
        } else {
          console.error("Profiles data is not an array", profilesData);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
        toast.error("Error al cargar perfiles");
      }
    };

    fetchProfiles();
  }, []);

  function handleApiErrors(errors: any) {
    if (Array.isArray(errors)) {
      errors.forEach((error: string) => {
        if (error.includes('nombre_usuario')) {
          setError('nombre_usuario', { message: error });
        } else if (error.includes('correo_electronico')) {
          setError('correo_electronico', { message: error });
        }
      });
    }
  }

  const onSubmit = async (data: FieldValues) => {
    try {
      // Encuentra el nombre del perfil asignado usando el ID seleccionado
      const selectedProfile = profiles.find(profile => profile.id === data.perfil_asignado);
      if (selectedProfile) {
        data.perfil_asignado = selectedProfile.nombre; // Reemplaza el ID con el nombre del perfil
      } else {
        console.error('Perfil no encontrado');
        toast.error('Perfil no encontrado');
        return;
      }

      // Llama a la API para registrar al usuario
      const response = await api.Account.register(data);
      console.log(response.data); // Manejar la respuesta del backend según sea necesario
      navigate('/login');
      toast.success('puedes iniciar sesion'); // Redirigir al usuario a la página de inicio de sesión después de registrarse
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
        Registrar usuario
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          fullWidth
          label="Nombre"
          autoFocus
          {...register('nombre', { required: 'Se necesita el nombre' })}
          error={!!errors.nombre}
          helperText={errors?.nombre?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Primer Apellido"
          {...register('primer_apellido', { required: 'Se necesita el primer Apellido' })}
          error={!!errors.primer_apellido}
          helperText={errors?.primer_apellido?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Segundo Apellido"
          {...register('segundo_apellido', { required: 'Se necesita el segundo Apellido' })}
          error={!!errors.segundo_apellido}
          helperText={errors?.segundo_apellido?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Nombre del usuario"
          {...register('nombre_usuario', { required: 'Se necesita el usuario' })}
          error={!!errors.nombre_usuario}
          helperText={errors?.nombre_usuario?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label="correo Electronico"
          {...register('correo_electronico', { required: 'Se necesita el correo' })}
          error={!!errors.correo_electronico}
          helperText={errors?.correo_electronico?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Contraseña"
          type="password"
          {...register('contrasena', { required: 'Se necesita la contraseña' })}
          error={!!errors.contrasena}
          helperText={errors?.contrasena?.message as string}
        />
        <FormControl fullWidth margin="normal" error={!!errors.perfil_asignado}>
          <InputLabel id="perfil-asignado-label">Perfil Asignado</InputLabel>
          <Select
            labelId="perfil-asignado-label"
            id="perfil_asignado"
            label="Perfil Asignado"
            {...register('perfil_asignado', { required: 'Se necesita el perfil asignado' })}
          >
            {profiles.map((profile) => (
              <MenuItem key={profile.id} value={profile.id}>
                {profile.nombre}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors?.perfil_asignado?.message as string}</FormHelperText>
        </FormControl>
        <LoadingButton
          loading={isSubmitting}
          disabled={!isValid}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Registrarse
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to="/login">
              {"Ya tienes una cuenta? Inicia Sesión"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
