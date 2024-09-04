import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Card,
    CardContent,
    TablePagination,
    Grid,
    Box,
    CircularProgress,
  } from "@mui/material";
  import { useParams } from "react-router-dom";
  import { Zona } from "../../app/models/zone";
  import { newAssetModels } from "../../app/models/newAssetModels";
  import { useState, useEffect } from "react";
  import api from "../../app/api/api";
  import React from "react";
  
  export default function MapDetails() {
    const { id } = useParams<{ id: string }>();
    const [zona, setZona] = useState<Zona | null>(null);
    const [assets, setAssets] = useState<newAssetModels[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [imageUrlMap, setImageUrlMap] = useState<string | null>(null);
  
    useEffect(() => {
      const loadZona = async () => {
        try {
          setLoading(true);
          const response = await api.Zones.getZonaById(parseInt(id as string));
          setZona(response.data);
          if (response.data.ImagenMapa) {
            setImageUrlMap(`http://localhost:5000/${response.data.ImagenMapa}`);
          }
          const assetsResponse = await api.newAsset.searchAssetsByZona(response.data.nombreZona);
          setAssets(assetsResponse.data);
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        } finally {
          setLoading(false);
        }
      };
  
      if (id) loadZona();
    }, [id]);
  
    const handlePageChange = (event: unknown, newPage: number) => setPage(newPage);
    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => setRowsPerPage(parseInt(event.target.value, 10));
  
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ padding: 2, marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>Detalles de la Zona</Typography>
              <Typography variant="h6">Nombre de la Zona: {zona?.nombreZona}</Typography>
              <Typography variant="h6">Número de Zona: {zona?.numeroZona}</Typography>
              <Typography variant="h6">Responsable: {zona?.responsableAreaNom_user}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Activos Relacionados:</Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
            </Box>
          ) : assets.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="Activos Relacionados">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">N°</TableCell>
                    <TableCell align="center">Número de Placa</TableCell>
                    <TableCell align="center">Número de Boleta</TableCell>
                    <TableCell align="center">Descripción</TableCell>
                    <TableCell align="center">Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((asset, index) => (
                    <TableRow key={asset.id}>
                      <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell align="center">{asset.NumeroPlaca}</TableCell>
                      <TableCell align="center">{asset.NumeroBoleta}</TableCell>
                      <TableCell align="center">{asset.Descripcion}</TableCell>
                      <TableCell align="center">{asset.Estado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={assets.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </TableContainer>
          ) : (
            <Typography variant="body1">No hay activos relacionados para esta zona.</Typography>
          )}
        </Grid>
        {imageUrlMap && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', marginTop: 2 }}>
              <Typography variant="h6">Mapa de la Zona:</Typography>
              <Box sx={{ position: 'relative', width: '100%', height: 'auto', maxHeight: '500px', overflow: 'hidden' }}>
                <img
                  src={imageUrlMap}
                  alt={`Mapa de la zona ${zona?.nombreZona}`}
                  style={{ width: '100%', height: 'auto', borderRadius: 8, cursor: 'pointer' }}
                  onClick={() => window.open(imageUrlMap, '_blank')}
                />
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    );
  }
  