import {
  Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow, TableBody,
  TablePagination, CircularProgress, Typography, Button, TextField
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
  const [loading, setLoading] = useState(true); 
  const [filterLetter, setFilterLetter] = useState<string>(""); // Estado para la letra de filtro
  const [data, setData] = useState<(newAssetModels | assetRetirementModel | assetSaleModel)[]>([]);
  const userProfile = useAppSelector((state) => state.account.user?.perfil_asignado);
  const userName = useAppSelector((state) => state.account.user?.nombre_usuario);

  const navigate = useNavigate();

  useEffect(() => {
    setPage(0);
    refreshData(); 
  }, [filterLetter]);

  const loadHistory = async (filter: string) => {
    setLoading(true);
    try {
      let response;
      if (filter === "" || filter === t('mostrar-todo')) {
        response = await api.history.getHistory();
      } else {
        response = await api.history.getHistory();
      }

      if (response.data) {
        let allData = response.data;

        if (userProfile !== 'Maestro') {
          allData = allData.filter((profile: any) => profile.Usuario === userName);
        }

        if (filter !== "" && filter !== t('mostrar-todo')) {
          allData = allData.filter((item: any) => item.NumeroBoleta && item.NumeroBoleta.startsWith(filter));
        }

        setData(allData);
      } else {
        console.error("La respuesta de la API no contiene 'data'.");
      }
    } catch (error) {
      console.error("Error al cargar el historial de activos:", error);
      toast.error(t('Toast-data'));
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => setPage(newPage);

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const refreshData = () => {
    localStorage.removeItem("assetHistoryData");
    loadHistory(filterLetter);
  };

  const handleDownloadExcel = () => {
    // Crear una hoja de Excel con los datos de la tabla
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historial");

    // Convertir el libro de trabajo a un archivo binario
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    // Guardar el archivo con FileSaver
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "historial_activos.xlsx");
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
          <Grid container spacing={2} alignItems="center">
            {/*<Grid item>
              <Button onClick={refreshData} variant="contained">
                {t('Actualizar datos')}
              </Button>
            </Grid>*/}
            <Grid item>
              <TextField
                label={t('Filtrar N° Boleta')}
                value={filterLetter}
                onChange={(e) => setFilterLetter(e.target.value.toLocaleUpperCase())}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item>
              <Button onClick={handleDownloadExcel} variant="contained" color="success">
               {t('Descargar Excel')}
              </Button>
            </Grid>
          </Grid>
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
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((profile, index) => (
                  <TableRow key={profile.NumeroBoleta}>
                    <TableCell align="center">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell align="center">{profile.NumeroBoleta}</TableCell>
                    <TableCell align="center">
                      {"NumeroPlaca" in profile
                        ? profile.NumeroPlaca
                        : profile.PlacaActivo || "N/A"}
                    </TableCell>
                    <TableCell align="center">{profile.Usuario}</TableCell>
                    <TableCell align="center">{profile.Descripcion}</TableCell>
                    <TableCell align="center">
                      {"DocumentoAprobado" in profile
                        ? profile.DocumentoAprobado
                          ? t('Aprobado')
                          : t('Desaprobado')
                        : "N/A"}
                    </TableCell>
                    <TableCell align="center">{"Tipo" in profile ? profile.Tipo : "N/A"}</TableCell>
                    <TableCell align="center">{"Zona" in profile ? profile.Zona : "N/A"}</TableCell>
                    <TableCell align="center">{"Estado" in profile ? profile.Estado : "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </TableContainer>
        </Grid>
      )}
    </Grid>
  );
}
