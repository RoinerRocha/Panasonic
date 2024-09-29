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
import { statusAssets } from "../../app/models/statusAsset";
import { useState, useEffect } from "react";
import api from "../../app/api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';

interface Props {
  statusAssets: statusAssets[];
  setStatusAssets: React.Dispatch<React.SetStateAction<statusAssets[]>>;
}

const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  setError: (error: string | null) => void
) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Enter"];
  if (!/[0-99999999]/.test(event.key) && !allowedKeys.includes(event.key)) {
    setError("Por favor ingrese un número");
    event.preventDefault();
  } else {
    setError(null); // Clear error if the key is valid
  }
};

const handleChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setError: (error: string | null) => void,
  setValue: (value: number) => void
) => {
  const value = event.target.value;
  if (/^\d*$/.test(value)) {
    // Solo permite números
    setValue(parseInt(value) || 0);
    setError(null); // Clear error on valid input
  } else {
    setError("Por favor ingrese un número");
  }
};

export default function StatusAssetList({
  statusAssets: statusAssets,
  setStatusAssets: setStatusAssets,
}: Props) {
  const [selectedStatusAsset, setSelectedStatusAsset] =
    useState<statusAssets | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newSatatusAsset, setNewStatusAsset] = useState<Partial<statusAssets>>({
    status: "",
  });
  const { t } = useTranslation();
  const { changeLanguage, language } = useLanguage();

  useEffect(() => {
    // Cargar los Estado Activos al montar el componente
    loadStatusAsset();
  }, []);

  const loadStatusAsset = async () => {
    try {
      const response = await api.statusAssets.getStatusAssets();
      setStatusAssets(response.data);
    } catch (error) {
      console.error("Error al cargar los Estado de Activos :", error);
      toast.error(t('Toast-Estado-Datos'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.statusAssets.deleteStatusAsset(id);
      toast.success(t('Toast-Estado-Eliminar'));
      loadStatusAsset();
    } catch (error) {
      console.error("Error al eliminar el Estado de Activo:", error);
      toast.error(t('Toast-Estado-Eliminar-Error'));
    }
  };

  const handleEdit = (statusAsset: statusAssets) => {
    setSelectedStatusAsset(statusAsset);
    setOpenEditDialog(true);
  };

  const handleUpdate = async () => {
    if (selectedStatusAsset) {
      try {
        const statusAssetId = selectedStatusAsset.id;
        const updatedStatusAsset = {
          status: selectedStatusAsset.status,
        };
        await api.statusAssets.updateStatusAsset(
          statusAssetId,
          updatedStatusAsset
        );
        toast.success(t('Toast-Estado-Editar'));
        setOpenEditDialog(false);
        loadStatusAsset();
      } catch (error) {
        console.error("Error al actualizar el Estado Activo:", error);
        toast.error(t('Toast-Estado-Editar-Error'));
      }
    }
  };

  const handleAdd = async () => {
    try {
      const addedStatusAsset = await api.statusAssets.saveStatusAsset(
        newSatatusAsset
      );
      toast.success(t('Toast-Estado-Agregar'));
      setOpenAddDialog(false);
      loadStatusAsset();
    } catch (error) {
      console.error("Error al agregar el Estado Activo:", error);
      toast.error(t('Toast-Estado-Agregar-Error'));
    }
  };

  const [error, setError] = useState<string | null>(null);

  const [anotherValue, setAnotherValue] = useState<number>(0);
  const [anotherError, setAnotherError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedStatusAssets = statusAssets.slice(startIndex, endIndex);

  return (
    <Grid container spacing={1}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddDialog(true)}
      >
        {t('EstadoActivos-BotonAgregar')}
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                {t('EstadoActivos-ColumnaEstado')}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                {t('EstadoActivos-ConlumnaConfiguracion')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStatusAssets.map((statusAsset) => (
              <TableRow key={statusAsset.id}>
                <TableCell align="center">{statusAsset.status}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="info"
                    sx={{ margin: "5px" }}
                    onClick={() => handleEdit(statusAsset)}
                  >
                    {t('EstadoActivos-BotonEditar')}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ margin: "5px" }}
                    onClick={() => handleDelete(statusAsset.id)}
                  >
                    {t('EstadoActivos-BotonEliminar')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[8, 16, 25]}
          component="div"
          count={statusAssets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(parseInt(event.target.value, 10))
          }
        />
      </TableContainer>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>{t('EstadoActivos-tituloEditar')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('EstadoActivos-SubtituloEditar')}
          </DialogContentText>
          <TextField
            label={t('EstadoActivos-tituloEstado')}
            value={selectedStatusAsset?.status || null}
            onChange={(e) =>
              setSelectedStatusAsset(
                selectedStatusAsset
                  ? {
                      ...selectedStatusAsset,
                      status: e.target.value,
                    }
                  : null
              )
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>{t('EstadoActivos-botonCancelar')}</Button>
          <Button onClick={handleUpdate}>{t('EstadoActivos-botonEditar')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>{t('EstadoActivos-TituloAgregar')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('EstadoActivos-SubTituloAgregar')}
          </DialogContentText>
          <TextField
            label={t('EstadoActivos-tituloEstado')}
            value={newSatatusAsset?.status}
            onChange={(e) =>
              setNewStatusAsset({
                ...newSatatusAsset,
                status: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>{t('EstadoActivos-BotonCancelarEstado')}</Button>
          <Button onClick={handleAdd}>{t('EstadoActivos-BotonAgregarEstado')}</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
