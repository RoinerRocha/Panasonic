import * as React from 'react';
import { Avatar, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import api from "../../app/api/api";
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';


export default function ResetPassword() {
    const { handleSubmit, control, formState: { errors, isValid } } = useForm({
        mode: 'onTouched'
    });

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const handdleNewPassword = async (data: any) => {
        if (!token) {
            toast.error(t('toast-token'));
            return;
        }

        try {
            const passwordReset = await api.Account.newPasword({ ...data, token });
            toast.success(t('toast-contra'));
            navigate('/login');  // Navegar a la página de login después de cambiar la contraseña
        } catch (error: any) {
            if (error.response && error.response.data.message === "El token ha expirado") {
                toast.error('El token ha expirado. Por favor, solicita un nuevo enlace de restablecimiento de contraseña.');
            } else if (error.response && error.response.data.message === "Token inválido") {
                toast.error('Token inválido. Por favor, solicita un nuevo enlace de restablecimiento de contraseña.');
            } else {
                toast.error(t('toast-token-error'));
            }
        }
    }
    const { t } = useTranslation();
    const { changeLanguage, language } = useLanguage();

    return (
        <Container component={Paper} maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                {t('Titulo')}
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit(handdleNewPassword)}>
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{ required: t('campo') }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('Correo')}
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
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{ required: t('campo') }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('Contra')}
                            type="password"
                            fullWidth
                            margin="dense"
                            required
                            error={!!errors.password}
                            helperText={errors.password ? String(errors.password.message) : ''}
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
                    {t('boton')}
                </Button>
            </Box>
        </Container>
    )
}
