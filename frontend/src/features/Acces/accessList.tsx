import {
    Grid,
    TableContainer,
    Paper,
    Table,
    TableCell,
    TableHead,
    TableRow,
    TableBody,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TablePagination,
} from "@mui/material";
import { accessModel } from "../../app/models/access";
import { useState, useEffect } from "react";

import api from "../../app/api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';

interface Props {
    accesses: accessModel[];
    setAccesses: React.Dispatch<React.SetStateAction<accessModel[]>>;
}

export default function AccessList({
    accesses: accesses,
    setAccesses: setAccesses
}: Props) {
    const [selectedAccess, setSelectedAccess] = useState<accessModel | null>(
        null
    );
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newAccess, setNewAccess] = useState<Partial<accessModel>>({
        // id: 0,
        Acceso: "",
    });
    const { t } = useTranslation();
    const { changeLanguage, language } = useLanguage();

    useEffect(() => {
        // Cargar los accesos al montar el componente
        loadAccess();
    }, []);

    const loadAccess = async () => {
        try {
          const response = await api.access.getAccess();
          setAccesses(response.data);
        } catch (error) {
          console.error("Error al cargar los accesos:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
          await api.access.deleteAccess(id);
          toast.success("Acceso eliminado");
          loadAccess();
        } catch (error) {
          console.error("Error al eliminar el acceso:", error);
        }
    };

    const handleEdit = (access: accessModel) => {
        setSelectedAccess(access);
        setOpenEditDialog(true);
    };

    const handleUpdate = async () => {
        if (selectedAccess) {
          try {
            const accessId = selectedAccess.id;
            const updatedAccess = {
              Acceso: selectedAccess.Acceso,
            };
            await api.access.updateAccess(accessId, updatedAccess);
            toast.success("Acceso Actualizado");
            setOpenEditDialog(false);
            loadAccess();
          } catch (error) {
            console.error("Error al actualizar permisos", error);
          }
        }
    };

    const handleAdd = async () => {
        try {
          const addedStatusAccess = await api.access.saveAccess(newAccess);
          toast.success("Acceso Agregado");
          setOpenAddDialog(false);
          loadAccess();
        } catch (error) {
          console.error("Error al agregar el acceso", error);
        }
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedAccess = accesses.slice(startIndex, endIndex);

    return( 
        <Grid container spacing={1}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenAddDialog(true)}
            >
                {t('Control-BotonAgregar')}
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                {t('Control-ColumnaAcceso')}
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                {t('Control-ColumnaConfiguracion')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedAccess.map((access) => (
                            <TableRow key={access.id}>
                                <TableCell align="center">{access.Acceso}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="info"
                                        sx={{ margin: "5px" }}
                                        onClick={() => handleEdit(access)}
                                    >
                                        {t('Control-BotonEditar')}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ margin: "5px" }}
                                        onClick={() => handleDelete(access.id)}
                                    >
                                        {t('Control-BotonEliminar')}
                                    </Button>
                                </TableCell>
                            </TableRow>      
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={accesses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) =>
                setRowsPerPage(parseInt(event.target.value, 10))
                }
            />

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>{t('ControlEdit-titulo')} </DialogTitle>
                <DialogContent>
                    <TextField
                        label={t('ControlEdit-Subtitulo')}
                        value={selectedAccess?.Acceso || null}
                        onChange={(e) =>
                        setSelectedAccess(
                            selectedAccess
                            ? {
                                ...selectedAccess,
                                Acceso: e.target.value,
                            }
                            : null
                        )
                        }
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>{t('ControlEdit-BotonCancelar')}</Button>
                    <Button onClick={handleUpdate}>{t('ControlEdit-BotonActualizar')}</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>{t('ControlAgregar-titulo')}</DialogTitle>
                <DialogContent>
                <TextField
                    label={t('ControlAgregar-Subtitulo')}
                    value={newAccess?.Acceso}
                    onChange={(e) =>
                    setNewAccess({
                        ...newAccess,
                        Acceso: e.target.value,
                    })
                    }
                    fullWidth
                    margin="dense"
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setOpenAddDialog(false)}>{t('ControlAgregar-BotonCancelar')}</Button>
                <Button onClick={handleAdd}>{t('ControlAgregar-BotonActualizar')}</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
