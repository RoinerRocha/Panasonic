import { 
    Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow, TableBody, 
    Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    FormHelperText,
    SelectChangeEvent
} from "@mui/material";

import React, { useState, useEffect } from "react";
import api from "../../app/api/api";
import { toast } from 'react-toastify';
import { User } from "../../app/models/user";
import { Link } from 'react-router-dom';
import { profileModels } from '../../app/models/profileModels'; 
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';

interface Props {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
}

export default function UserList({ users, setUsers }: Props){
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [profiles, setProfiles] = useState<profileModels[]>([]);

    useEffect(() => {
        // Cargar los usuarios y perfiles al montar el componente
        loadUsers();
        fetchData();
    }, []);

    const fetchData = async () => {//se carga los perfiles en el comboxPerfiles
        try {
            const [perfilesData] = await Promise.all([
            api.profiles.getProfiles()
        ]);
        if (perfilesData && Array.isArray(perfilesData.data)) {
            setProfiles(perfilesData.data);
          } else {
            console.error("Profiles data is not an array", perfilesData);
          }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error(t('toast-Usuarios'));
        }
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const name = event.target.name as keyof profileModels;
        const value = event.target.value;
        setProfiles((prevAsset) => ({
          ...prevAsset,
          [name]: value,
        }));
      };


    const loadUsers = async () => {
        try {
            const response = await api.Account.getAllUser();
            setUsers(response.data);
        } catch (error) {
            console.error("Error al cargar las zonas:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.Account.deleteUser(id);
            toast.success(t('toast-Usuarios-Eliminado'));
            // Recargar las zonas después de eliminar
            loadUsers();
        } catch (error) {
            console.error("Error al eliminar al usuario:", error);
            toast.error(t('toast-Usuarios-Eliminado-error'));
        }
    };

    const handleEdit = (usuario:  User) => {
        setSelectedUser(usuario);
        setOpenEditDialog(true);
    }

    const handleUpdate = async () => {
        if (selectedUser) {
            try {
                const accountId = selectedUser.id;
                const updateUser = {
                    nombre: selectedUser.nombre,
                    primer_apellido: selectedUser.primer_apellido,
                    segundo_apellido: selectedUser.segundo_apellido,
                    nombre_usuario: selectedUser.nombre_usuario,
                    correo_electronico: selectedUser.correo_electronico,
                    perfil_asignado: selectedUser.perfil_asignado,
                    contrasena: selectedUser.contrasena,
                };
                await api.Account.updateUser(accountId, updateUser);
                toast.success(t('toast-Usuarios-Editar'));
                setOpenEditDialog(false);
                loadUsers();
            } catch (error) {
                console.error("Error al actualizar al usuario:", error);
                toast.error(t('toast-Usuarios-Editar-error'));
            }
        }
    }

    const { t } = useTranslation();
    const { changeLanguage, language } = useLanguage();
    
    return(
        <Grid container spacing={1}>
            <Button variant="contained" color="primary" component={Link} to="/register">
                {t('boton-tabla-usuario')}
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                            <TableCell align="center">{t('nombre-tabla-usuarios')}</TableCell>
                            <TableCell align="center">{t('primer-apellido-tabla-usuarios')}</TableCell>
                            <TableCell align="center">{t('segundo-apellido-tabla-usuarios')}</TableCell>
                            <TableCell align="center">{t('nomUsuario-tabla-usuario')}</TableCell>
                            <TableCell align="center">{t('correo-tabla-usuario')}</TableCell>
                            <TableCell align="center">{t('perfil-tabla-usuario')}</TableCell>
                            <TableCell align="center">{t('contraseña')}</TableCell>
                            <TableCell align="center">{t('acciones-tabla-usuario')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((users)=>(
                            <TableRow key={users.id}>
                                <TableCell align="center">{users.nombre}</TableCell>
                                <TableCell align="center">{users.primer_apellido}</TableCell>
                                <TableCell align="center">{users.segundo_apellido}</TableCell>
                                <TableCell align="center">{users.nombre_usuario}</TableCell>
                                <TableCell align="center">{users.correo_electronico}</TableCell>
                                <TableCell align="center">{users.perfil_asignado}</TableCell>
                                <TableCell align="center">{users.contrasena.replace(/./g, '●')}</TableCell>
                                <TableCell align='center'>
                                    <Button 
                                        variant='contained' 
                                        color='info' 
                                        sx={{ margin: '0 8px' }} 
                                        onClick={() => handleEdit(users)}
                                    >
                                        {t('botonEditar-tabla-usuario')}
                                    </Button>
                                    <Button 
                                        variant='contained' 
                                        color='error' 
                                        sx={{ margin: '0 8px' }} 
                                        onClick={() => handleDelete(users.id)}
                                    >
                                        {t('botonEliminar-tabla-usuario')}
                                    </Button>
                                </TableCell>
                                
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openEditDialog} onClose={()=> setOpenEditDialog(false)}>
                <DialogTitle>{t('dialog-titlo1-tablaUsuario')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('dialog-titlo2-tablaUsuario')}
                    </DialogContentText>
                    <TextField
                        label={t('dialog-nombre-tablaUsuario')}
                        value={selectedUser?.nombre || ''}
                        onChange={(e) => setSelectedUser(selectedUser ? { ...selectedUser, nombre: e.target.value } : null)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label={t('dialog-primerApellido-tablaUsuario')}
                        value={selectedUser?.primer_apellido || ''}
                        onChange={(e) => setSelectedUser(selectedUser ? { ...selectedUser, primer_apellido: e.target.value } : null)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label={t('dialog-segundoApellido-tablaUsuario')}
                        value={selectedUser?.segundo_apellido || ''}
                        onChange={(e) => setSelectedUser(selectedUser ? { ...selectedUser, segundo_apellido: e.target.value } : null)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label={t('dialog-usuario-tablaUsuario')}
                        value={selectedUser?.nombre_usuario || ''}
                        onChange={(e) => setSelectedUser(selectedUser ? { ...selectedUser, nombre_usuario: e.target.value } : null)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label={t('dialog-correo-tablaUsuario')}
                        value={selectedUser?.correo_electronico || ''}
                        onChange={(e) => setSelectedUser(selectedUser ? { ...selectedUser, correo_electronico: e.target.value } : null)}
                        fullWidth
                        margin="dense"
                    />
                  
                      <FormControl fullWidth margin="normal">
                        <InputLabel id="perfil-asignado-label">{t('dialog-perfil-tablaUsuario')}</InputLabel>
                        <Select
                           labelId="perfil-asignado-label"
                           id="perfil_asignado"
                           label="Perfil Asignado"
                           value={selectedUser?.perfil_asignado || ''}
                           onChange={(e) => setSelectedUser(selectedUser  ? { ...selectedUser, 'perfil_asignado': e.target.value } : null)}
                         >
                           {profiles.map((profile) => (
                             <MenuItem key={profile.id} value={profile.nombre}>
                               {profile.nombre}
                             </MenuItem>
                           ))}
                        </Select>
                      </FormControl>
                    <TextField
                        label={t('contraseña')}
                        value={selectedUser?.contrasena || ''}
                        onChange={(e) => setSelectedUser(selectedUser ? { ...selectedUser, contrasena: e.target.value } : null)}
                        fullWidth
                        margin="dense"
                        type="password"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>{t('dialog-Cancel-tablaUsuario')}</Button>
                    <Button onClick={handleUpdate}>{t('dialog-Edit-tablaUsuario')}</Button>
                </DialogActions>
            </Dialog>    
        </Grid>
    )
}