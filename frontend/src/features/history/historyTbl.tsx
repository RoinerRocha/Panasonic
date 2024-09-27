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
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/configureStore";
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';

import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";

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
  const { t } = useTranslation();
  const { changeLanguage, language } = useLanguage();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [selectedBoleta, setSelectedBoleta] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filterLetter, setFilterLetter] = useState<string>(t('mostrar-todo'));
  const [data, setData] = useState<(newAssetModels | assetRetirementModel | assetSaleModel)[]>([]);
  //para abrir el dialog
  const [open, setOpen] = useState(false);
  const userProfile = useAppSelector((state) => state.account.user?.perfil_asignado);
  const userName = useAppSelector((state) => state.account.user?.nombre_usuario);
  

  useEffect(() => {
    setPage(0);
    loadHistory(filterLetter);
  }, [filterLetter]);

  const navigate = useNavigate();

  const handleClickOpen = (NumeroBoleta: string) => {
    setSelectedBoleta(NumeroBoleta);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBoleta(null);
    setSelectedFile(null);
  };

  // antes del cambio

  const loadHistory = async (filter: string) => {
    setLoading(true);
    try {
      let response;
      
      if (filter === t('mostrar-todo')) {
        response = await api.history.getHistory();
      } else {
        response = await api.history.searchHistoryByNumeroBoleta(filter);
      }
      
      // Combinar los datos
      let allData = [
        ...(response.data.newAssets || []),
        ...(response.data.assetSales || []),
        ...(response.data.assetRetirements || [])
      ];
  
      // Aplicar el filtro de usuario solo si el perfil no es 'Maestro'
      if (userProfile !== 'Maestro') {
        allData = allData.filter(profile => profile.Usuario === userName);
      }
    
      setData(allData);
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
      navigate('/');
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
  const uniqueProfiles = combinedProfiles.filter(
    (value, index, self) => index === self.findIndex((t) => t.id === value.id)
  );

  // Método para verificar el estado de DocumentoAprobado
  const verificarDocumentoAprobado = (
    profile: assetRetirementModel | assetSaleModel
  ): string => {
    return profile.DocumentoAprobado ? "Aprobado" : "Pendiente";
  };

  

  const filteredProfiles = filterLetter === t('mostrar-todo')
  ? uniqueProfiles
  : uniqueProfiles.filter(profile => profile.NumeroBoleta.startsWith(filterLetter));

  const finalProfiles = userProfile === 'Maestro' 
  ? filteredProfiles // Si es Maestro, no aplicamos ningún filtro adicional
  : filteredProfiles.filter(profile => profile.Usuario === userName);


  const paginatedProfiles = finalProfiles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Función para descargar el archivo Excel
  
const downloadExcelFile = async (boletas: string[]) => {
  try {
    // Usa la función correcta para generar el archivo
    const fileBlob = await api.history.generateExcelFileByBoletas(boletas);
    const url = window.URL.createObjectURL(new Blob([fileBlob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Boletas.xlsx'); // El nombre del archivo que se descargará
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading the Excel file:', error);
    toast.error(t("toasty-excel-error"));
  }
};



  return (
    <Grid container spacing={1}>
      {loading ? (
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="h6">{t('cargar-datos')}</Typography>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="filter-letter-label">{t('filtro-titulo')}</InputLabel>
            <Select
              labelId="filter-letter-label"
              id="filter-letter"
              value={filterLetter}
              onChange={(e: SelectChangeEvent<string>) => setFilterLetter(e.target.value)}
              name="filterLetter"
              label="Filtro por Letra"
            >
              <MenuItem value={t('mostrar-todo')}>
                <em>{t('mostrar-todo')}</em>
              </MenuItem>
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="C">C</MenuItem>
              <MenuItem value="B">B</MenuItem>
            </Select>
            <FormHelperText>{t('texto-secundario')}</FormHelperText>
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
                    t('NumeroBoleta'),
                    t('NumeroPlaca'),
                    t('Usuario'),
                    t('Descripcion'),
                    t('Aprobacion'),
                    t('Tipo'),
                    t('Zona'),
                    t('Estado'),
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
                             {t('Aprobado')}
                          </>
                        ) : (
                          t('Desaprobado')
                        )
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
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
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={filteredProfiles.length} // Cambia el conteo a la cantidad filtrada
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </TableContainer>
          
          <Button
            variant="contained"
            color="success"
            sx={{ margin: "10px" }}
            onClick={(event) => {
              event.stopPropagation();
              // Obtén las boletas de los perfiles paginados
              const boletas = paginatedProfiles.map(profile => profile.NumeroBoleta).filter(boleta => boleta !== undefined);
              downloadExcelFile(boletas);
            }}
          >
            {t('Boton-Historial')}
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
