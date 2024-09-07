import {
  Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow, TableBody,
  TablePagination, CircularProgress, Typography, Button, DialogContent, Dialog,
  DialogActions, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, SelectChangeEvent
} from "@mui/material";
import { assetRetirementModel } from "../../app/models/assetRetirementModel";
import { assetSaleModel } from "../../app/models/assetSaleModel";
import { newAssetModels } from "../../app/models/newAssetModels";
import { useState, useEffect } from "react";
import api from "../../app/api/api";
import { toast } from "react-toastify";

import RegisterAsset from "../assetRetirement/assetRetirementFrm";

interface Props {
  newAssetModels: newAssetModels[];
  setNewAssetModels: React.Dispatch<React.SetStateAction<newAssetModels[]>>;
  assetRetirementModels: assetRetirementModel[];
  setAssetRetirementModels: React.Dispatch<
    React.SetStateAction<assetRetirementModel[]>
  >;
  assetSaleModels: assetSaleModel[];
  setAssetSaleModels: React.Dispatch<React.SetStateAction<assetSaleModel[]>>;
}

export default function HistoryTbl({
  newAssetModels,
  setNewAssetModels,
  assetRetirementModels,
  setAssetRetirementModels,
  assetSaleModels,
  setAssetSaleModels,
}: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [selectedBoleta, setSelectedBoleta] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filterLetter, setFilterLetter] = useState<string>("Mostrar todo");
  const [data, setData] = useState<(newAssetModels | assetRetirementModel | assetSaleModel)[]>([]);
  //para abrir el dialog
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setPage(0);
    loadHistory(filterLetter);
  }, [filterLetter, open]);

  const handleClickOpen = (NumeroBoleta: string) => {
    setSelectedBoleta(NumeroBoleta);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBoleta(null);
    setSelectedFile(null);
  };

  const loadHistory = async (filter: string) => {
    setLoading(true);
    try {
      let response;
      if (filter === "Mostrar todo") {
        response = await api.history.getHistory();
      } else {
        response = await api.history.searchHistoryByNumeroBoleta(filter);
      }
      console.log("Datos cargados:", response.data); // Verifica la estructura de los datos
      setData([
        ...(response.data.newAssets || []),
        ...(response.data.assetSales || []),
        ...(response.data.assetRetirements || [])
      ]);
    } catch (error) {
      console.error("Error al cargar el historial de activos:", error);
      toast.error("Error al cargar el historial de activos");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };
  

  const handleUpload = async () => {
    if (!selectedBoleta || !selectedFile) return;

    const formData = new FormData();
    formData.append("DocumentoAprobado", selectedFile);

    try {
      await api.history.uploadDocumentByBoleta(selectedBoleta, formData);
      toast.success("Documento subido exitosamente");
      handleClose();
      loadHistory(filterLetter);
    } catch (error) {
      console.error("Error al subir el documento:", error);
      toast.error("Error al subir el documento");
    }
  };

  const handlePageChange = (event: unknown, newPage: number) =>
    setPage(newPage);


  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);  // Resetear la página al cambiar la cantidad de filas por página
  };

  const combinedProfiles = [
    ...newAssetModels,
    ...assetRetirementModels,
    ...assetSaleModels,
  ];

  // Eliminación de duplicados basados en el 'id'
  const uniqueProfiles = combinedProfiles.reduce((acc, current) => {
    const x = acc.find((item) => item.id === current.id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [] as (newAssetModels | assetRetirementModel | assetSaleModel)[]);

  // Método para verificar el estado de DocumentoAprobado
  const verificarDocumentoAprobado = (
    profile: assetRetirementModel | assetSaleModel
  ): string => {
    return profile.DocumentoAprobado ? "Aprobado" : "Pendiente";
  };

  

  const filteredProfiles = filterLetter === "Mostrar todo"
  ? uniqueProfiles
  : uniqueProfiles.filter(profile => profile.NumeroBoleta.startsWith(filterLetter));

  const paginatedProfiles = filteredProfiles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Grid container spacing={1}>
      {loading ? (
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="h6">Cargando datos...</Typography>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="filter-letter-label">Filtro por Letra</InputLabel>
            <Select
              labelId="filter-letter-label"
              id="filter-letter"
              value={filterLetter}
              onChange={(e: SelectChangeEvent<string>) => setFilterLetter(e.target.value)}
              name="filterLetter"
              label="Filtro por Letra"
            >
              <MenuItem value="Mostrar todo">
                <em>Mostrar todo</em>
              </MenuItem>
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="C">C</MenuItem>
              <MenuItem value="B">B</MenuItem>
            </Select>
            <FormHelperText>Seleccione una letra para filtrar los activos</FormHelperText>
          </FormControl>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  {[
                    "N°",
                    "N° BOLETA",
                    "N° PLACA",
                    "USUARIO",
                    "DESCRIPCIÓN",
                    "Estado Documento Aprobación",
                    "ID",
                    "TIPO",
                    "ZONA",
                    "ESTADO",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      align="center"
                      sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProfiles.map((profile, index) => (
                  <TableRow key={profile.id}>
                    <TableCell align="center">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell align="center">{profile.NumeroBoleta}</TableCell>
                    <TableCell align="center">
                      {profile.hasOwnProperty("NumeroPlaca")
                        ? (profile as newAssetModels).NumeroPlaca
                        : profile.hasOwnProperty("PlacaActivo")
                        ? (profile as assetRetirementModel | assetSaleModel).PlacaActivo
                        : "N/A"}
                    </TableCell>
                    {/*revisar, ya que sale prueba en vez de numPlaca*/}
                    <TableCell align="center">{profile.Usuario}</TableCell>
                    <TableCell align="center">{profile.Descripcion}</TableCell>
                    <TableCell align="center">
                      {"DocumentoAprobado" in profile ? (
                        verificarDocumentoAprobado(
                          profile as assetRetirementModel | assetSaleModel
                        ) === "Pendiente" ? (
                          <>
                             <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleClickOpen(profile.NumeroBoleta)}
                            >
                              Pendiente Agregar Doc
                            </Button>

                            <Dialog open={open} onClose={handleClose}>
                              <DialogTitle>Subir Documento Aprobado</DialogTitle>
                              <DialogContent>
                                <TextField
                                  type="file"
                                  onChange={handleFileChange}
                                  fullWidth
                                />
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                  Cancelar
                                </Button>
                                <Button onClick={handleUpload} color="primary">
                                  Subir
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </>
                        ) : (
                          "Aprobado"
                        )
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell align="center">{profile.id}</TableCell>
                    <TableCell align="center">
                      {"Tipo" in profile
                        ? (profile as newAssetModels).Tipo
                        : "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {"Zona" in profile
                        ? (profile as newAssetModels).Zona
                        : "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {"Estado" in profile
                        ? (profile as newAssetModels).Estado
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={filteredProfiles.length} // Cambia el conteo a la cantidad filtrada
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Grid>
      )}
    </Grid>
  );
}
