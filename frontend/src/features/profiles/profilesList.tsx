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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { profileModels } from "../../app/models/profileModels";
import { accessModel } from "../../app/models/access";
import { useState, useEffect } from "react";
import api from "../../app/api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';

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
  const [access, setAccess] = useState<accessModel[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newProfile, setNewProfile] = useState<Partial<profileModels>>({
    // id: 0,
    nombre: "",
    permisoAcceso: "",
  });
  const { t } = useTranslation();
  const { changeLanguage, language } = useLanguage();

  useEffect(() => {
    // Cargar los Estado Activos al montar el componente
    loadProfile();
    loadAccess();
  }, []);

  const loadAccess = async () => {
    try {
      const response = await api.access.getAccess(); 
      setAccess(response.data);
    } catch (error) {
      console.error("Error al cargar los permisos de acceso:", error);
    }
  };

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
        {t('Perfil-botonAgregar')}
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                {t('Perfil-columnaNombre')}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                {t('Perfil-columnaPermiso')}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                {t('Perfil-columnaConfiguracion')}
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
                    {t('Perfil-botonEditar')}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ margin: "5px" }}
                    onClick={() => handleDelete(profile.id)}
                  >
                    {t('Perfil-botonEliminar')}
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
        <DialogTitle>{t('EditarPerfil-titulo')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('EditarPerfil-tituloNombre')}
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="perfil-asignado-label">{t('EditarPerfil-tituloPermiso')}</InputLabel>
            <Select
              label="Permiso de Acceso del Usuario"
              value={selectedProfile?.permisoAcceso || ""}
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
            >
              {access.map((accessName) => (
                <MenuItem key={accessName.id} value={accessName.Acceso}>
                  {accessName.Acceso}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>{t('EditarPerfil-botonCancelar')}</Button>
          <Button onClick={handleUpdate}>{t('EditarPerfil-botonActualizar')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>{t('AgregarPerfil-titulo')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('AgregarPerfil-tituloPerfil')}
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="perfil-asignado-label">{t('AgregarPerfil-tituloPermiso')}</InputLabel>
            <Select
              label="Permiso de Acceso del Usuario"
              value={newProfile?.permisoAcceso || ""}
              onChange={(e) =>
                setNewProfile({
                  ...newProfile,
                  permisoAcceso: e.target.value,
                })
              }
            >
              {access.map((accessName) => (
                <MenuItem key={accessName.id} value={accessName.Acceso}>
                  {accessName.Acceso}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>{t('AgregarPerfil-botonCancelar')}</Button>
          <Button onClick={handleAdd}>{t('AgregarPerfil-botonAgregar')}</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
