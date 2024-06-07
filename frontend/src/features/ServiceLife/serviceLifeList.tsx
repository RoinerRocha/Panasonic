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
import { serviceLifeModels } from "../../app/models/serviceLifeModels";
import { useState, useEffect } from "react";
import api from "../../app/api/api";
import { toast } from "react-toastify";

interface Props {
  serviceLifes: serviceLifeModels[];
  setServiceLifes: React.Dispatch<React.SetStateAction<serviceLifeModels[]>>;
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

export default function ServiceLifeList({
  serviceLifes: serviceLifes,
  setServiceLifes: setServiceLifes,
}: Props) {
  const [selectedSserviceLife, setSelectedserviceLife] =
    useState<serviceLifeModels | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newServiceLife, setNewServiceLife] = useState<
    Partial<serviceLifeModels>
  >({
     id: 0,
    tipo: "",
    añoUtil: 0,
  });

  useEffect(() => {
    // Cargar la losta de Mh al montar el componente
    loadServiceLife();
  }, []);

  const loadServiceLife = async () => {
    try {
      const response = await api.serviceLife.getServiceLifes();
      setServiceLifes(response.data);
    } catch (error) {
      console.error("Error al cargar la lista del Mh:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.serviceLife.deleteServiceLife(id);
      toast.success("Lista Mh Eliminado");
      loadServiceLife();
    } catch (error) {
      console.error("Error al eliminar Tipo de la lista Mh:", error);
    }
  };

  const handleEdit = (serviceLife: serviceLifeModels) => {
    setSelectedserviceLife(serviceLife);
    setOpenEditDialog(true);
  };

  const handleUpdate = async () => {
    if (selectedSserviceLife) {
      try {
        const serviceLifeId = selectedSserviceLife.id;
        const updatedServiceLife = {
          tipo: selectedSserviceLife.tipo,
          añoUtil: selectedSserviceLife.añoUtil,
        };
        await api.serviceLife.updateServiceLife(
          serviceLifeId,
          updatedServiceLife
        );
        toast.success("Lista Mh Actualizada");
        setOpenEditDialog(false);
        loadServiceLife();
      } catch (error) {
        console.error("Error al actualizar la lista Mh:", error);
      }
    }
  };

  const handleAdd = async () => {
    try {
      const addedStatusAsset = await api.serviceLife.saveServiceLife(
        newServiceLife
      );
      toast.success("Tipo Mh Agregado");
      setOpenAddDialog(false);
      loadServiceLife();
    } catch (error) {
      console.error("Error al agregar tipo de la lista Mh:", error);
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedServiceLife = serviceLifes.slice(startIndex, endIndex);

  const [error, setError] = useState<string | null>(null);

  const [anotherValue, setAnotherValue] = useState<number>(0);
  const [anotherError, setAnotherError] = useState<string | null>(null);
  return (
    <Grid container spacing={1}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddDialog(true)}
      >
        Agregar Tipo
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                Tipo
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                Vida Útil
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                CONFIGURACIÓN
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedServiceLife.map((serviceLife) => (
              <TableRow key={serviceLife.id}>
                <TableCell align="center">{serviceLife.tipo}</TableCell>
                <TableCell align="center">{serviceLife.añoUtil}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="info"
                    sx={{ margin: "5px" }}
                    onClick={() => handleEdit(serviceLife)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ margin: "5px" }}
                    onClick={() => handleDelete(serviceLife.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 15, 25]}
        component="div"
        count={serviceLifes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) =>
          setRowsPerPage(parseInt(event.target.value, 10))
        }
      />

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Tipo </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre Tipo"
            value={selectedSserviceLife?.tipo || null}
            onChange={(e) =>
              setSelectedserviceLife(
                selectedSserviceLife
                  ? {
                      ...selectedSserviceLife,
                      tipo: e.target.value,
                    }
                  : null
              )
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>

        <DialogContent>
          <TextField
            label="Vida Útil"
            value={selectedSserviceLife?.añoUtil || null}
            onChange={(e) =>
                setSelectedserviceLife(
                    selectedSserviceLife
                      ? {
                          ...selectedSserviceLife,
                          añoUtil: parseInt(e.target.value),
                        }
                      : null
                  )
                }
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
        <DialogTitle>Agregar tipo</DialogTitle>
        <DialogContent>
          <TextField
            label="Nuevo Nombre Tipo"
            value={newServiceLife?.tipo}
            onChange={(e) =>
              setNewServiceLife({
                ...newServiceLife,
                tipo: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogContent>
          <TextField
            label="Vida Útil"
            value={newServiceLife?.añoUtil}
            onChange={(e) =>
              handleChange(e, setError, (val) =>
                setNewServiceLife({
                  ...newServiceLife,
                  añoUtil: val,
                })
              )
            }
            onKeyDown={(e) =>
              handleKeyDown(e as React.KeyboardEvent<HTMLDivElement>, setError)
            }
            fullWidth
            margin="dense"
            error={Boolean(error)}
            helperText={error}
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
