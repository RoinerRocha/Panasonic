import * as React from 'react';
import { Avatar, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from "../../app/models/resetPassword";
import { toast } from 'react-toastify';
import { Controller,  useForm } from 'react-hook-form';
import api from "../../app/api/api";


export default function ResetPassword() {
    const { handleSubmit, control, formState: { errors, isValid } } = useForm({
        mode: 'onTouched'
    });

    const navigate = useNavigate();

    const handdleNewPassword = async (data: any) => {
        try {
            const passwordReset = await api.Account.newPasword(data);
            toast.success('contraseña restablecida');
            navigate('/login');  // Navegar a la página de login después de cambiar la contraseña
        } catch (error) {
            console.error("Error al restablecer contraseña:", error);
            toast.error('Error al restablecer la contraseña');
        }
    }

    return (
        <Container component={Paper} maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Nueva Contraseña
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit(handdleNewPassword)}>
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Correo del usuario"
                            fullWidth
                            margin="dense"
                            autoFocus
                            required
                            error={!!errors.email}
                            helperText={errors.email ? String(errors.email.message) : ''}
                        />
                    )}
                />
                <Controller
                    name="Password"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Nueva Contraseña"
                            type="password"
                            fullWidth
                            margin="dense"
                            required
                            error={!!errors.Password}
                            helperText={errors.Password ? String(errors.Password.message) : ''}
                        />
                    )}
                />
                <Button 
                    variant='contained' 
                    color='info'
                    sx={{ margin: '5px' }} 
                    type="submit"
                    disabled={!isValid}
                >
                    Enviar
                </Button>
            </Box>
        </Container>
    )
}