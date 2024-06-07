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
import { profileModels } from "../../app/models/profileModels";
import { useState, useEffect } from "react";
import api from "../../app/api/api";
import { toast } from "react-toastify";

interface Props {
  profiles: profileModels[];
  setProfiles: React.Dispatch<React.SetStateAction<profileModels[]>>;
}

export default function ProfilesList({
  profiles: profiles,
  setProfiles: setProfiles,
}: Props) {
  const [selectedProfile, setSelectedProfile] = useState<profileModels | null>(
    null
  );
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newProfile, setNewProfile] = useState<Partial<profileModels>>({
    // id: 0,
    nombre: "",
    permisoAcceso: "",
  });

  useEffect(() => {
    // Cargar los Estado Activos al montar el componente
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.profiles.getProfiles();
      setProfiles(response.data);
    } catch (error) {
      console.error("Error al cargar los Perfiles de Usuarios (Rol):", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.profiles.deleteProfile(id);
      toast.success("Perfil de Usuario Eliminado");
      loadProfile();
    } catch (error) {
      console.error("Error al eliminar el Perfil de Usuario (Rol):", error);
    }
  };

  const handleEdit = (profile: profileModels) => {
    setSelectedProfile(profile);
    setOpenEditDialog(true);
  };

  const handleUpdate = async () => {
    if (selectedProfile) {
      try {
        const profileId = selectedProfile.id;
        const updatedProfile = {
          nombre: selectedProfile.nombre,
          permisoAcceso: selectedProfile.permisoAcceso,
        };
        await api.profiles.updateProfile(profileId, updatedProfile);
        toast.success("Perfil de Usuario Actualizado");
        setOpenEditDialog(false);
        loadProfile();
      } catch (error) {
        console.error("Error al actualizar el Perfil de Usario (Rol):", error);
      }
    }
  };

  const handleAdd = async () => {
    try {
      const addedStatusAsset = await api.profiles.saveProfile(newProfile);
      toast.success("Perfil Agregado");
      setOpenAddDialog(false);
      loadProfile();
    } catch (error) {
      console.error("Error al agregar el Perfil de Usuario (Rol):", error);
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProfiles = profiles.slice(startIndex, endIndex);

  return (
    <Grid container spacing={1}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddDialog(true)}
      >
        Agregar Perfil
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                NOMBRE
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                PERMISOS DE ACCESO
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
            {paginatedProfiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell align="center">{profile.nombre}</TableCell>
                <TableCell align="center">{profile.permisoAcceso}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="info"
                    sx={{ margin: "5px" }}
                    onClick={() => handleEdit(profile)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ margin: "5px" }}
                    onClick={() => handleDelete(profile.id)}
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
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={profiles.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) =>
          setRowsPerPage(parseInt(event.target.value, 10))
        }
      />

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Perfil </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre Perfil"
            value={selectedProfile?.nombre || null}
            onChange={(e) =>
              setSelectedProfile(
                selectedProfile
                  ? {
                      ...selectedProfile,
                      nombre: e.target.value,
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
            label="Permiso de Acceso"
            value={selectedProfile?.permisoAcceso || null}
            onChange={(e) =>
              setSelectedProfile(
                selectedProfile
                  ? {
                      ...selectedProfile,
                      permisoAcceso: e.target.value,
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
        <DialogTitle>Agregar Perfil</DialogTitle>
        <DialogContent>
          <TextField
            label="Nuevo Perfil"
            value={newProfile?.nombre}
            onChange={(e) =>
              setNewProfile({
                ...newProfile,
                nombre: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogContent>
          <TextField
            label="Permiso de Acceso del Usuario"
            value={newProfile?.permisoAcceso}
            onChange={(e) =>
              setNewProfile({
                ...newProfile,
                permisoAcceso: e.target.value,
              })
            }
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
