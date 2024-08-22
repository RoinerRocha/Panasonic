import React, { useState, useEffect } from "react";
import { Grid, TableContainer, 
    Paper, Table, TableCell, TableHead, TableRow, TableBody, Button, 
    TextField, Dialog, DialogActions, DialogContent, DialogContentText, 
    DialogTitle, styled, FormControl,  InputLabel, Select, MenuItem
} from "@mui/material";
import { Zona } from "../../app/models/zone";
import api from "../../app/api/api";
import { User } from "../../app/models/user";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';

interface Props {
    zonas: Zona[];
    setZonas: React.Dispatch<React.SetStateAction<Zona[]>>;
}

export default function ZoneList({ zonas, setZonas }: Props) {
    const [selectedZona, setSelectedZona] = useState<Zona | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [newZona, setNewZona] = useState<Partial<Zona>>({
        numeroZona: '',
        nombreZona: '',
        responsableAreaNom_user: ''
    });
    const [imageUrlMap, setImageUrlMap] = useState<Map<number, Map<string, string>>>(new Map());

    useEffect(() => {
        // Cargar las zonas al montar el componente
        loadZonas();
        fetchData();
    }, []);
    

    const loadZonas: () => Promise<void> = async () => {
        try {
            const response = await api.Zones.getZona();
            setZonas(response.data);
            convertImagesToDataUrl(response.data);
        } catch (error) {
            console.error("Error al cargar las zonas:", error);
        }
    };

    const fetchData = async () => {
        try {
            const [userData] = await Promise.all([
                api.Account.getAllUser()
            ]);
            if (userData && Array.isArray(userData.data)) {
                setUsers(userData.data);
            } else {
                console.error("users data is not an array", userData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Error al cargar datos");
        }
    };


    const convertImagesToDataUrl = (zonesImage: Zona[]) => {
        zonesImage.forEach((zona) =>{
            if (zona.ImagenMapa) {
                setImageUrlMap((prevMap) => {
                    const mapaZona = prevMap.get(zona.id) || new Map();
                    const imageUrl = `http://localhost:5000/${zona.ImagenMapa}`;
                    mapaZona.set('ImagenMapa', imageUrl);
                    return new Map(prevMap).set(zona.id, mapaZona);
                });
            }
        });
    }

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

    const handleEdit = (newZona: Zona) => {
        setSelectedZona(newZona);
        setNewZona({...newZona})
        setOpenEditDialog(true);
    };

    const handleUpdate = async () => {
        if (selectedZona) {
            try {
                const formData = new FormData();
                formData.append('numeroZona', newZona.numeroZona?.toString() ?? '');
                formData.append('nombreZona', newZona.nombreZona?.toString() ?? '');
                formData.append('responsableAreaNom_user', newZona.responsableAreaNom_user?.toString() ?? '');
                if (newZona.ImagenMapa) {
                    formData.append('ImagenMapa', newZona.ImagenMapa);
                }
                console.log(selectedZona.id);
                await api.Zones.updateZona(selectedZona.id, formData);
                toast.success('Zona Actualizada');
                setOpenEditDialog(false);
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

    const { t } = useTranslation();
    const { changeLanguage, language } = useLanguage();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const handleRowClick = (newZona: Zona) =>{
        setSelectedZona(newZona);
        setOpenDetailDialog(true);
    }

    const VisuallyHiddenInput = styled("input")({
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        height: 1,
        overflow: "hidden",
        position: "absolute",
        bottom: 0,
        left: 0,
        whiteSpace: "nowrap",
        width: 1,
      });

    const [imageUrlMap1, setImageUrlMap1] = useState<Map<string, string>>(new Map());

    return (
        <Grid container spacing={1}>
            <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>
                {t('BotonAgregar-zona')}
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">{t('Numero-zona')}</TableCell>
                            <TableCell align="center">{t('Nombre-zona')}</TableCell>
                            <TableCell align="center">{t('Encargado-zona')}</TableCell>
                            <TableCell align="center">{t('Image-zona')}</TableCell>
                            <TableCell align="center">{t('Configuracion-zona')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {zonas.slice(startIndex, endIndex).map((zona) => (
                            <TableRow key={zona.id}>
                                <TableCell align="center">{zona.numeroZona}</TableCell>
                                <TableCell align="center">{zona.nombreZona}</TableCell>
                                <TableCell align="center">{zona.responsableAreaNom_user}</TableCell>
                                <TableCell align="center">
                                    {imageUrlMap.get(zona.id)?.get('ImagenMapa') ? (
                                        <img
                                            src={imageUrlMap.get(zona.id)?.get('ImagenMapa')}
                                            alt="ImagenMapa"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                    ): 'sin imagen'}
                                </TableCell>
                                <TableCell align='center'>
                                    <Button 
                                        variant='contained' 
                                        color='info' 
                                        sx={{ margin: '0 8px' }} 
                                        onClick={() => handleEdit(zona)}
                                    >
                                        {t('BotonEditar-zona')}
                                    </Button>
                                    <Button 
                                        variant='contained' 
                                        color='error' 
                                        sx={{ margin: '0 8px' }} 
                                        onClick={() => handleDelete(zona.id)}
                                    >
                                        {t('BotonEliminar-zona')}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>{t('DialogTitulo-zona')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('DialogTitulo2-zona')}
                    </DialogContentText>
                    <TextField
                        label={t('DialogNumero-zona')}
                        value={newZona?.numeroZona || ''}
                        onChange={(e) => setNewZona({ ...newZona, numeroZona: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label={t('DialogNombre-zona')}
                        value={newZona?.nombreZona || ''}
                        onChange={(e) => setNewZona({ ...newZona, nombreZona: e.target.value})}
                        fullWidth
                        margin="dense"
                    />
                    {/* <TextField
                        label={t('DialogEncargado-zona')}
                        value={newZona?.responsableAreaNom_user || ''}
                        onChange={(e) => setNewZona({ ...newZona, responsableAreaNom_user: e.target.value})}
                        fullWidth
                        margin="dense"
                    /> */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="encargado-label">{t('DialogEncargado-zona')}</InputLabel>
                        <Select
                            labelId="encargado-label"
                            id="encargado"
                            label={t('DialogEncargado-zona')}
                            value={newZona?.responsableAreaNom_user || ''}
                            onChange={(e) => setNewZona({ ...newZona, responsableAreaNom_user: e.target.value})}
                        >
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.nombre_usuario}>
                                {user.nombre_usuario}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>{t('DialogBotonCancelar-zona')}</Button>
                    <Button onClick={handleUpdate}>{t('DialogBotonEditar-zona')}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>{t('AgregarTitulo1-zona')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('AgregarTitulo2-zona')}
                    </DialogContentText>
                    <TextField
                        label={t('AgregarNumero-zona')}
                        value={newZona.numeroZona}
                        onChange={(e) => setNewZona({ ...newZona, numeroZona: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label={t('AgregarNombre-zona')}
                        value={newZona.nombreZona}
                        onChange={(e) => setNewZona({ ...newZona, nombreZona: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label={t('AgregarEncargado-zona')}
                        value={newZona.responsableAreaNom_user}
                        onChange={(e) => setNewZona({ ...newZona, responsableAreaNom_user: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>{t('AgregarBotonCancelar-zona')}</Button>
                    <Button onClick={handleAdd}>{t('AgregarBotonAñadir-zona')}</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}
