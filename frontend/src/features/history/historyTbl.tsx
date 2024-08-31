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
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await api.history.getHistory();
      setNewAssetModels(response.data.newAssets || []);
      setAssetSaleModels(response.data.assetSales || []);
      setAssetRetirementModels(response.data.assetRetirements || []);
    } catch (error) {
      console.error("Error al cargar el historial de activos:", error);
      toast.error("Error al cargar el historial de activos");
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => setRowsPerPage(parseInt(event.target.value, 10));

  const combinedProfiles = [...newAssetModels, ...assetRetirementModels, ...assetSaleModels];

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
  const verificarDocumentoAprobado = (profile: assetRetirementModel | assetSaleModel): string => {
    return profile.DocumentoAprobado ? "Aprobado" : "Pendiente";
  };

  const paginatedProfiles = uniqueProfiles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Grid container spacing={1}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {["N°", "N° BOLETA", "N° PLACA", "USUARIO", "DESCRIPCIÓN", "Estado Documento Aprobación", "ID", "TIPO", "ZONA", "ESTADO"].map((header) => (
                <TableCell key={header} align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProfiles.map((profile, index) => (
              <TableRow key={profile.id}>
                <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                <TableCell align="center">{profile.NumeroBoleta}</TableCell>
                <TableCell align="center">{"NumeroPlaca" in profile ? (profile as newAssetModels).NumeroPlaca:"N/A"}</TableCell>
                <TableCell align="center">{profile.Usuario}</TableCell>
                <TableCell align="center">{profile.Descripcion}</TableCell>
                <TableCell align="center">
                  {"DocumentoAprobado" in profile ? verificarDocumentoAprobado(profile as assetRetirementModel | assetSaleModel) : "N/A"}
                </TableCell>
                <TableCell align="center">{profile.id}</TableCell>
                <TableCell align="center">{'Tipo' in profile ? (profile as newAssetModels).Tipo : "N/A"}</TableCell>
                <TableCell align="center">{'Zona' in profile ? (profile as newAssetModels).Zona : "N/A"}</TableCell>
                <TableCell align="center">{'Estado' in profile ? (profile as newAssetModels).Estado : "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={uniqueProfiles.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Grid>
  );
}
