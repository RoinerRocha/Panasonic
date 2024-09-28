import React, { useState, useEffect } from "react";
import { Grid, TableContainer, 
    Paper, Table, TableCell, TableHead, TableRow, TableBody, Button, 
    TextField, Dialog, DialogActions, DialogContent, DialogContentText, 
    DialogTitle, styled, FormControl,  InputLabel, Select, MenuItem,
    FormHelperText, TablePagination
} from "@mui/material";
import { Zona } from "../../app/models/zone";
import api from "../../app/api/api";
import { User } from "../../app/models/user";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
        responsableAreaNom_user: '',
        ImagenMapa: null,
    });
    const [imageUrlMap, setImageUrlMap] = useState<Map<number, Map<string, string>>>(new Map());
    const navigate = useNavigate();

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
            toast.error(t('ToastZona-datos'));
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
            toast.success(t('ToastZona-eliminar'));
            // Recargar las zonas después de eliminar
            loadZonas();
        } catch (error) {
            console.error("Error al eliminar la zona:", error);
            toast.error(t('ToastZona-eliminar-error'));
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
                toast.success(t('ToastZona-editar'));
                setOpenEditDialog(false);
                loadZonas();
            } catch (error) {
                console.error("Error al actualizar la zona:", error);
                toast.error(t('ToastZona-editar-error'));
            }
        }
    };

    const onSubmit = async (data: FieldValues) =>{
        try {
            await api.Zones.saveZona(data);
            toast.success(t('ToastZona-agregar'));
            setOpenAddDialog(false);
            loadZonas();
        } catch (error) {
            console.error(error);
            toast.error(t('ToastZona-agregar-error'));
        }
    }

    const handleAdd = (data: FieldValues) => {
        const formData = new FormData();
        formData.append("numeroZona", newZona.numeroZona?.toString() ?? '');
        formData.append("nombreZona", newZona.nombreZona?.toString() ?? '');
        formData.append("responsableAreaNom_user", newZona.responsableAreaNom_user?.toString() ?? '');
        if (newZona.ImagenMapa) {
            formData.append("ImagenMapa", newZona.ImagenMapa);
        }
        onSubmit(formData);
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = event.target;
        if (files && files.length > 0) {
          setNewZona((prevAsset) => ({
            ...prevAsset,
            [name]: files[0],
          }));
        }
      };

    const { t } = useTranslation();
    const { changeLanguage, language } = useLanguage();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const handleRowClick = (zona: Zona) =>{
        setSelectedZona(zona);
        setOpenDetailDialog(true);
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      };

      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

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
                            <TableRow key={zona.id} onClick={() => handleRowClick(zona)} style={{ cursor: "pointer" }}>
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
                                    onClick={(e) => {
                                        e.stopPropagation(); // Detiene la propagación del evento
                                        handleEdit(zona);
                                    }}
                                >
                                    {t('BotonEditar-zona')}
                                </Button>
                                <Button 
                                    variant='contained' 
                                    color='error' 
                                    sx={{ margin: '0 8px' }} 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Detiene la propagación del evento
                                        handleDelete(zona.id);
                                    }}
                                >
                                    {t('BotonEliminar-zona')}
                                </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={zonas.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                />
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
                    <Grid item xs={6}>
                        {newZona.ImagenMapa && (
                            <img src={imageUrlMap.get(newZona.id || 0)?.get('ImagenMapa')} alt="ImagenMapa" style={{ width: '100px', height: '100px', objectFit: 'cover' }}/>
                        )}
                        <Button variant="contained" component="label" fullWidth>
                            {newZona.ImagenMapa? t('DialogBotonImagen-zona') : t('DialogBotonImagen2-zona') }
                            <VisuallyHiddenInput 
                                 type="file"
                                 name="ImagenMapa"
                                 onChange={(e) => {
                                   const file = e.target.files?.[0];  // Obtener el primer archivo seleccionado
                                   if (file) {
                                        const fileUrl = URL.createObjectURL(file);
                                        setNewZona({...newZona, ImagenMapa: file});
                                        setImageUrlMap1(prevMap => new Map(prevMap).set(file.name, fileUrl));
                                    }
                                 }}
                            />
                        </Button>
                        {newZona.ImagenMapa && <FormHelperText>{t('DialogImagenTexto-zona')} {newZona.ImagenMapa.name}</FormHelperText>}
                        {imageUrlMap1.get(newZona.ImagenMapa?.name || '') && (
                            <img src={imageUrlMap1.get(newZona.ImagenMapa?.name || '')} alt="ImagenMapa" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        )}
                    </Grid>
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
                    <Grid item xs={12}>
                        <Button variant="contained" component="label" fullWidth>
                                {t('AgregarBotonImagen-zona')}
                            <VisuallyHiddenInput
                            type="file"
                            name="ImagenMapa"
                            onChange={handleFileInputChange}
                            />
                        </Button>
                        {newZona.ImagenMapa && <FormHelperText>{t('AgregarTituloImagen-zona')} {newZona.ImagenMapa.name}</FormHelperText>}
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>{t('AgregarBotonCancelar-zona')}</Button>
                    <Button onClick={handleAdd}>{t('AgregarBotonAñadir-zona')}</Button>
                </DialogActions>
            </Dialog>
            <Dialog  open={openDetailDialog} onClose={() => setOpenDetailDialog(false)}>
                <DialogTitle>{t('DetallesZona-titulo')}</DialogTitle>
                <DialogContent>
                    <div>
                        <p><strong>{t('DetallesZona-Numero')}</strong> {selectedZona?.numeroZona}</p>
                        <p><strong>{t('DetallesZona-Nombre')}</strong> {selectedZona?.nombreZona}</p>
                        <p><strong>{t('DetallesZona-Responsable')}</strong> {selectedZona?.responsableAreaNom_user}</p>
                        {imageUrlMap.get(selectedZona?.id || 0)?.get('ImagenMapa') && (
                        <p>
                            <strong>{t('DetallesZona-Mapa')}</strong>
                            <img
                            src={imageUrlMap.get(selectedZona?.id || 0)?.get('ImagenMapa')}
                            alt="Mapa"
                            style={{ width: 550, height: 550 }}
                            />
                        </p>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetailDialog(false)}>{t('DetallesZona-Boton')}</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}
