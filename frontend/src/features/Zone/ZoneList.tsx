import React, { useState, useEffect } from "react";
import { Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow, TableBody, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Zona } from "../../app/models/zone";
import api from "../../app/api/api";
import { toast } from 'react-toastify';

interface Props {
    zonas: Zona[];
    setZonas: React.Dispatch<React.SetStateAction<Zona[]>>;
}

export default function ZoneList({ zonas, setZonas }: Props) {
    const [selectedZona, setSelectedZona] = useState<Zona | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newZona, setNewZona] = useState<Partial<Zona>>({
        numeroZona: '',
        nombreZona: '',
        responsableAreaNom_user: ''
    });

    useEffect(() => {
        // Cargar las zonas al montar el componente
        loadZonas();
    }, []);

    const loadZonas = async () => {
        try {
            const response = await api.Zones.getZona();
            setZonas(response.data);
        } catch (error) {
            console.error("Error al cargar las zonas:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.Zones.deleteZona(id);
            toast.success('Zona Eliminada');
            // Recargar las zonas después de eliminar
            loadZonas();
        } catch (error) {
            console.error("Error al eliminar la zona:", error);
        }
    };

    const handleEdit = (zona: Zona) => {
        setSelectedZona(zona);
        setOpenEditDialog(true);
    };

    const handleUpdate = async () => {
        if (selectedZona) {
            try {
                const zonaId = selectedZona.id;
                const updatedZona = {
                    numeroZona: selectedZona.numeroZona,
                    nombreZona: selectedZona.nombreZona,
                    responsableAreaNom_user: selectedZona.responsableAreaNom_user,
                };
                await api.Zones.updateZona(zonaId, updatedZona);
                toast.success('Zona Actualizada');
                setOpenEditDialog(false);
                // Recargar las zonas después de actualizar
                loadZonas();
            } catch (error) {
                console.error("Error al actualizar la zona:", error);
            }
        }
    };

    const handleAdd = async () => {
        try {
            const addedZona = await api.Zones.saveZona(newZona);
            toast.success('Zona Agregada');
            setOpenAddDialog(false);
            // Recargar las zonas después de agregar
            loadZonas();
        } catch (error) {
            console.error("Error al agregar la zona:", error);
        }
    };

    return (
        <Grid container spacing={1}>
            <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>
                Agregar Zona
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Número</TableCell>
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">Encargado</TableCell>
                            <TableCell align="center">Configuración</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {zonas.map((zona, index) => (
                            <TableRow key={`${zona.id}-${index}`}>
                                <TableCell align="center">{zona.numeroZona}</TableCell>
                                <TableCell align="center">{zona.nombreZona}</TableCell>
                                <TableCell align="center">{zona.responsableAreaNom_user}</TableCell>
                                <TableCell align='center'>
                                    <Button 
                                        variant='contained' 
                                        color='info' 
                                        sx={{ margin: '0 8px' }} 
                                        onClick={() => handleEdit(zona)}
                                    >
                                        Editar
                                    </Button>
                                    <Button 
                                        variant='contained' 
                                        color='error' 
                                        sx={{ margin: '0 8px' }} 
                                        onClick={() => handleDelete(zona.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Editar Zona</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Edita la zona seleccionada
                    </DialogContentText>
                    <TextField
                        label="Número de Zona"
                        value={selectedZona?.numeroZona || ''}
                        onChange={(e) => setSelectedZona(selectedZona ? { ...selectedZona, numeroZona: e.target.value } : null)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Nombre de Zona"
                        value={selectedZona?.nombreZona || ''}
                        onChange={(e) => setSelectedZona(selectedZona ? { ...selectedZona, nombreZona: e.target.value } : null)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Encargado"
                        value={selectedZona?.responsableAreaNom_user || ''}
                        onChange={(e) => setSelectedZona(selectedZona ? { ...selectedZona, responsableAreaNom_user: e.target.value } : null)}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
                    <Button onClick={handleUpdate}>Actualizar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Agregar Zona</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Agrega una nueva zona
                    </DialogContentText>
                    <TextField
                        label="Número de Zona"
                        value={newZona.numeroZona}
                        onChange={(e) => setNewZona({ ...newZona, numeroZona: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Nombre de Zona"
                        value={newZona.nombreZona}
                        onChange={(e) => setNewZona({ ...newZona, nombreZona: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Encargado"
                        value={newZona.responsableAreaNom_user}
                        onChange={(e) => setNewZona({ ...newZona, responsableAreaNom_user: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>Cancelar</Button>
                    <Button onClick={handleAdd}>Agregar</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}
