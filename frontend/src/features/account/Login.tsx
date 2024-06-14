import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FieldValues, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../store/configureStore';
import { signInUser } from './accountSlice';
import { Email } from '../../app/models/email';
import api from "../../app/api/api";


export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.account);
  const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState<Partial<Email>>({
    email: ''
  });

  const { register, handleSubmit, formState: { isSubmitting, errors, isValid, isSubmitSuccessful } } = useForm({
    mode: 'onTouched'
  });

  const handdleAddEmail = async () => {
    try {
      const addEmail = await api.Account.sendEmail(newEmail);
      toast.success('Email Enviado');
      setOpenAddDialog(false);
    } catch (error) {
      console.error("Error al agregar la zona:", error);
    }
  }

  const onSubmit = async (data: FieldValues) => {
    try {
      // Llama a la acción signInUser para iniciar sesión
      await dispatch(signInUser(data));
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de inicio de sesión');
    }
  };

  // Espera a que se complete la acción signInUser y luego verifica el estado de autenticación
  React.useEffect(() => {
    if (isAuthenticated) {
      // Si el usuario está autenticado, redirige a la página '/'
      navigate('/');
      toast.success('Bienvenido');
    } else if (isSubmitSuccessful) {
      // Si el formulario ha sido enviado pero el usuario no está autenticado, muestra la alerta de credenciales incorrectas
      toast.error('Credenciales incorrectas');
    }
  }, [isAuthenticated, isSubmitSuccessful, navigate]);

  return (
    <Container component={Paper} maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
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
          {...register('nombre_usuario', { required: 'Se necesita el usuario' })}
          error={!!errors.nombre_usuario}
          helperText={errors?.nombre_usuario?.message as string}
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
        <LoadingButton
          loading={isSubmitting}
          disabled={!isValid}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Iniciar Sesion
        </LoadingButton>
        <Grid container>
          <Grid item xs>
            <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>
                Recuperar Contraseña
            </Button>
          </Grid>
          <Grid item>
            <Link to="/register">
              {"No tienes una cuenta? regístrate"}
            </Link>
          </Grid>
        </Grid>
      </Box>
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Enviar Email de Recuperacion</DialogTitle>
          <DialogContent>
            <TextField
                label="Email de recuperacion"
                value={newEmail.email}
                onChange={(e) => setNewEmail({ ...newEmail, email: e.target.value })}
                fullWidth
                margin="dense"
            />
          </DialogContent>
          <DialogActions>
              <Button onClick={() => setOpenAddDialog(false)}>Cancelar</Button>
              <Button onClick={handdleAddEmail}>Enviar</Button>
          </DialogActions>
      </Dialog>
    </Container>
  );
};




