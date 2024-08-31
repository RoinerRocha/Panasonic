import {
    Grid,
    TableContainer,
    Paper,
    Table,
    TableCell,
    TableHead,
    TableRow,
    TableBody,
    TablePagination,
  } from "@mui/material";
  import { assetRetirementModel } from "../../app/models/assetRetirementModel";
  import { assetSaleModel } from "../../app/models/assetSaleModel";
  import { newAssetModels } from "../../app/models/newAssetModels";
  import { useState, useEffect } from "react";
  import api from "../../app/api/api";
  import { toast } from "react-toastify";
  
  interface Props {
    newAssetModels: newAssetModels[];
    setNewAssetModels: React.Dispatch<React.SetStateAction<newAssetModels[]>>;
    assetRetirementModels: assetRetirementModel[];
    setAssetRetirementModels: React.Dispatch<React.SetStateAction<assetRetirementModel[]>>;
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
  
    useEffect(() => {
      // Cargar el historial al montar el componente
      loadHistory();
    }, []);
  
    const loadHistory = async () => {
      try {
        const response = await api.history.getHistory();
        setNewAssetModels(response.data);
        setAssetSaleModels(response.data);
        setAssetRetirementModels(response.data);
      } catch (error) {
        console.error("Error al cargar el historial de activos:", error);
        toast.error("Error al cargar el historial de activos");
      }
    };
  
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedProfiles = newAssetModels.slice(startIndex, endIndex);
  
    return (
      <Grid container spacing={1}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                  N°
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                  N° BOLETA
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                  USUARIO
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                  DESCRIPCIÓN
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                  Estado Documento Aprobación
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                  ID
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                  TIPO
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                  ZONA
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                  ESTADO
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProfiles.map((profile, index) => (
                <TableRow key={profile.id}>
                  <TableCell align="center">{startIndex + index + 1}</TableCell>
                  <TableCell align="center">{profile.NumeroBoleta}</TableCell>
                  <TableCell align="center">{profile.Usuario}</TableCell>
                  <TableCell align="center">{profile.Descripcion}</TableCell>
                  <TableCell align="center">{"Pendiente"}</TableCell>
                  <TableCell align="center">{profile.id}</TableCell>
                  <TableCell align="center">{profile.Tipo}</TableCell>
                  <TableCell align="center">{profile.Zona}</TableCell>
                  <TableCell align="center">{profile.Estado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={newAssetModels.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        />
      </Grid>
    );
  }