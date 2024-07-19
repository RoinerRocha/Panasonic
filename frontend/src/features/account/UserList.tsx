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
            toast.error("Error al cargar datos");
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
            toast.success('Usuario Eliminado');
            // Recargar las zonas después de eliminar
            loadUsers();
        } catch (error) {
            console.error("Error al eliminar al usuario:", error);
            toast.error('Error al eliminar el usuario');
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
                };
                await api.Account.updateUser(accountId, updateUser);
                toast.success('Usuario Actualizado');
                setOpenEditDialog(false);
                loadUsers();
            } catch (error) {
                console.error("Error al actualizar al usuario:", error);
            }
        }
    }
    
    return(
        <Grid container spacing={1}>
            <Button variant="contained" color="primary" component={Link} to="/register">
                Registrar Usuario
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">Primer Apellido</TableCell>
                            <TableCell align="center">Segundo Apellido</TableCell>
                            <TableCell align="center">Nombre de usuario</TableCell>
                            <TableCell align="center">Correo electronico</TableCell>
                            <TableCell align="center">Perfil Asignado</TableCell>
                            <TableCell align="center">Configuración</TableCell>
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
                                <TableCell align='center'>
                                    <Button 
                                        variant='contained' 
                                        color='info' 
                                        sx={{ margin: '0 8px' }} 
                                        onClick={() => handleEdit(users)}
                                    >
                                        Editar
                                    </Button>
                                    <Button 
                                        variant='contained' 
                                        color='error' 
                                        sx={{ margin: '0 8px' }} 
                                        onClick={() => handleDelete(users.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openEditDialog} onClose={()=> setOpenEditDialog(false)}>
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Editar el usuario seleccionado
                    </DialogContentText>
                    <TextField
                        label="Nombre"
                        value={selectedUser?.nombre || ''}
                        onChange={(e) => setSelectedUser(selectedUser ? { ...selectedUser, nombre: e.target.value } : null)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Primer Apellido"
                        value={selectedUser?.primer_apellido || ''}
                        onChange={(e) => setSelectedUser(selectedUser ? { ...selectedUser, primer_apellido: e.target.value } : null)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Segundo Apellido"
                        value={selectedUser?.segundo_apellido || ''}
                        onChange={(e) => setSelectedUser(selectedUser ? { ...selectedUser, segundo_apellido: e.target.value } : null)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Segundo Apellido"
                        value={selectedUser?.nombre_usuario || ''}
                        onChange={(e) => setSelectedUser(selectedUser ? { ...selectedUser, nombre_usuario: e.target.value } : null)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Correo Electronico"
                        value={selectedUser?.correo_electronico || ''}
                        onChange={(e) => setSelectedUser(selectedUser ? { ...selectedUser, correo_electronico: e.target.value } : null)}
                        fullWidth
                        margin="dense"
                    />
                  
                      <FormControl fullWidth margin="normal">
                        <InputLabel id="perfil-asignado-label">Perfil Asignado</InputLabel>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
                    <Button onClick={handleUpdate}>Actualizar</Button>
                </DialogActions>
            </Dialog>    
        </Grid>
    )
}