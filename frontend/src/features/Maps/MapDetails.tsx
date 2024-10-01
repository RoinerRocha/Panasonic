import React, { useState, useEffect, useCallback } from 'react';
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
  Button,
  Stack,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import api from '../../app/api/api';
import { Zona } from '../../app/models/zone';
import { newAssetModels } from '../../app/models/newAssetModels';
import { useAppSelector } from '../../store/configureStore';
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';

const MapDetails = () => {
  const { t } = useTranslation();
  const { changeLanguage, language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [zona, setZona] = useState<Zona | null>(null);
  const [assets, setAssets] = useState<newAssetModels[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [imageUrlMap, setImageUrlMap] = useState<Map<number, string>>(new Map());
  const [assetPositions, setAssetPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const { user } = useAppSelector((state) => state.account); // Obtener el usuario del estado
  const isMaestro = user?.perfil_asignado === 'Maestro';
  // Función para cargar datos de la zona y los activos
  const loadZona = useCallback(async () => {
    try {
      setLoading(true);
      const { data: zonaData } = await api.Zones.getZonaById(parseInt(id as string));
      setZona(zonaData);

      if (zonaData.ImagenMapa) {
        setImageUrlMap((prevMap) => new Map(prevMap).set(zonaData.id, `http://localhost:5000/${zonaData.ImagenMapa}`));
      }

      const { data: assetsData } = await api.newAsset.searchAssetsByZona(zonaData.nombreZona);
      setAssets(assetsData);

      // Cargar posiciones de activos desde la API
      const { data: positionsResponse } = await api.newAsset.getAssetPositions(zonaData.nombreZona);
      if (positionsResponse?.assets) {
        const positions = positionsResponse.assets.reduce((acc: any, asset: any) => {
          acc[asset.id] = { x: asset.posX, y: asset.posY };
          return acc;
        }, {});
        setAssetPositions(positions);
      }

      // Cargar posiciones guardadas en localStorage
      const savedPositions = localStorage.getItem(`positions-${id}`);
      if (savedPositions) {
        setAssetPositions(JSON.parse(savedPositions));
      }
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadZona();
  }, [id, loadZona]);

  const handlePageChange = (event: unknown, newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setRowsPerPage(parseInt(event.target.value, 10));

  // Función para manejar el drop y actualizar posiciones
  const handleDrop = (item: DraggedItem, monitor: any) => {
    const delta = monitor.getDifferenceFromInitialOffset();
    const x = (assetPositions[item.id]?.x || 0) + delta.x;
    const y = (assetPositions[item.id]?.y || 0) + delta.y;

    const updatedPositions = { ...assetPositions, [item.id]: { x, y } };
    setAssetPositions(updatedPositions);
  };

  // Guardar posiciones tanto en el servidor como en localStorage
  const saveAssetPositions = async () => {
    try {
      await api.newAsset.saveAssetPositions({ assetPositions });
      localStorage.setItem(`positions-${id}`, JSON.stringify(assetPositions));
       toast.success(t('Mapa-ToastGuardar'));
    } catch (error) {
      console.error('Error al guardar las posiciones:', error);
      toast.error(t('Mapa-ToastGuardar-error'));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  const AssetIcon = ({ asset, index }: { asset: newAssetModels; index: number }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'asset',
      item: { id: asset.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }), [isMaestro] );

    return (
      <div
        ref={isMaestro ? drag : null}
        style={{
          position: 'absolute',
          left: assetPositions[asset.id]?.x || 0,
          top: assetPositions[asset.id]?.y || 0,
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
          textAlign: 'center',
        }}
      >
        <img
          src={`http://localhost:5000/${asset.Fotografia}`}
          alt={`Imagen del activo ${asset.NumeroPlaca}`}
          style={{ width: '50px', height: '50px' }}
        />
        <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '2px 5px', fontSize: '10px' }}>
          {`${t('Mapa-Placa')}: ${asset.NumeroPlaca}`}
        </div>
        <div style={{ position: 'absolute', top: '0', left: '0', backgroundColor: 'rgba(255, 0, 0, 0.7)', color: 'white', padding: '2px 5px', fontSize: '10px' }}>
          {`#${index + 1}`}
        </div>
      </div>
    );
  };

  type DraggedItem = { id: number };

  const MapDropArea = () => {
    const [, drop] = useDrop(() => ({
      accept: 'asset',
      drop: (item: DraggedItem, monitor) => handleDrop(item, monitor),
    }));

    return (
      <div ref={drop} style={{ position: 'relative', width: '100%', height: '500px' }}>
        {zona && imageUrlMap.get(zona.id) && (
          <img
            src={imageUrlMap.get(zona.id)!}
            alt="Mapa de la Zona"
            style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }}
          />
        )}
        {assets.map((asset, index) => (
          <AssetIcon key={asset.id} asset={asset} index={index} />
        ))}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
  <Typography variant="h5">{t('Mapa-Titulo1')}</Typography>
  {zona ? (
    <Stack spacing={1}>
      <Typography variant="body1">{`${t('Mapa-Numero')}: ${zona.numeroZona || 'N/A'}`}</Typography>
      <Typography variant="body1">{`${t('Mapa-Nombre')}: ${zona.nombreZona || 'N/A'}`}</Typography>
      <Typography variant="body1">{`${t('Mapa-encargado')}: ${zona.responsableAreaNom_user || 'N/A'}`}</Typography>
    </Stack>
  ) : (
    <Typography variant="body1">{t('Zona no disponible')}</Typography>
  )}
</CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5">{t('Mapa-Titulo2')}</Typography>
              <MapDropArea />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>{t('Mapa-tabla1')}</TableCell>
                  <TableCell>{t('Mapa-Tabla2')}</TableCell>
                  <TableCell>{t('Mapa-Tabla3')}</TableCell>
                 {/* <TableCell>{t('Mapa-Tabla4')}</TableCell>
                  <TableCell>{t('Mapa-Tabla5')}</TableCell>*/}
                  <TableCell>{t('DetallesLista-TituloProveedor')}</TableCell>
                  <TableCell>{t('Lista-ColumnaFecha')}</TableCell>
                  <TableCell>{t('NumeroBoleta')}</TableCell>
                  <TableCell>{t('Tipo')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((asset, index) => (
                  <TableRow key={asset.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{asset.Descripcion}</TableCell>
                    <TableCell>{asset.NumeroPlaca}</TableCell>
                    <TableCell>{asset.Estado}</TableCell>
                    <TableCell>{asset.NombreProveedor}</TableCell>
                    <TableCell>{asset.FechaCompra ? new Date(asset.FechaCompra).toLocaleDateString() : 'Fecha no disponible'}</TableCell>
                    <TableCell>{asset.NumeroBoleta}</TableCell>
                    <TableCell>{asset.Tipo}</TableCell>
                    {/*<TableCell>{assetPositions[asset.id]?.x || '-'}</TableCell>
                    <TableCell>{assetPositions[asset.id]?.y || '-'}</TableCell>*/}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={assets.length}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={saveAssetPositions} disabled={!isMaestro}>
              {t('Mapa-BotonGuardar')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </DndProvider>
  );
};

export default MapDetails;
