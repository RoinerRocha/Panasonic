import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { Zona } from '../../app/models/zone';
import { newAssetModels } from '../../app/models/newAssetModels';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import api from '../../app/api/api';

export default function MapDetails() {
  const { id } = useParams<{ id: string }>();
  const [zona, setZona] = useState<Zona | null>(null);
  const [assets, setAssets] = useState<newAssetModels[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [imageUrlMap, setImageUrlMap] = useState<Map<number, Map<string, string>>>(new Map());
  const [assetPositions, setAssetPositions] = useState<{ [key: string]: { x: number; y: number } }>({});

  useEffect(() => {
    const loadZona = async () => {
      try {
        setLoading(true);
  
        const response = await api.Zones.getZonaById(parseInt(id as string));
        setZona(response.data);
      
  
        if (response.data.ImagenMapa) {
          convertImagesToDataUrl([response.data]);
        }
  
        const assetsResponse = await api.newAsset.searchAssetsByZona(response.data.nombreZona);
        setAssets(assetsResponse.data);
  
        const positionsResponse = await api.newAsset.getAssetPositions(response.data.nombreZona);
        console.log('Respuesta completa del backend:', positionsResponse);
  
        if (positionsResponse?.data?.assets && Array.isArray(positionsResponse.data.assets)) {
          const positions = positionsResponse.data.assets.reduce((acc: any, asset: any) => {
            acc[asset.id] = { x: asset.posX, y: asset.posY };
            return acc;
          }, {});
          
          console.log('Posiciones procesadas:', positions);
          setAssetPositions(positions);  // Actualizar las posiciones de los activos
        } else {
          console.error('No se pudieron cargar las posiciones de los activos o el formato es incorrecto.');
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) loadZona();
  }, [id]);
  
  
  
  
  

  // Método para convertir imágenes a URL
  const convertImagesToDataUrl = (zonesImage: Zona[]) => {
    zonesImage.forEach((zona) => {
      if (zona.ImagenMapa) {
        setImageUrlMap((prevMap) => {
          const mapaZona = prevMap.get(zona.id) || new Map();
          const imageUrl = `http://localhost:5000/${zona.ImagenMapa}`;
          mapaZona.set('ImagenMapa', imageUrl);
          return new Map(prevMap).set(zona.id, mapaZona);
        });
      }
    });
  };

  const handlePageChange = (event: unknown, newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setRowsPerPage(parseInt(event.target.value, 10));

  const handleDrop = (item: DraggedItem, monitor: any) => {
    const delta = monitor.getDifferenceFromInitialOffset();
    const x = (assetPositions[item.id]?.x || 0) + delta.x;
    const y = (assetPositions[item.id]?.y || 0) + delta.y;
    setAssetPositions({ ...assetPositions, [item.id]: { x, y } });
  };

  const saveAssetPositions = async () => {
    try {
      const positionsToSave = { assetPositions };
      await api.newAsset.saveAssetPositions(positionsToSave);
      alert('Posiciones guardadas correctamente');
    } catch (error) {
      console.error('Error al guardar las posiciones:', error);
      alert('Error al guardar las posiciones');
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
    }));
  
    // Verificación adicional de si la posición existe
    console.log("Posición de activo:", asset.id, assetPositions[asset.id] ? `X: ${assetPositions[asset.id].x}, Y: ${assetPositions[asset.id].y}` : "Sin posición");
  
    return (
      <div
        ref={drag}
        style={{
          position: 'absolute',
          left: assetPositions[asset.id]?.x || 0,  // Aquí debe tomar las posiciones guardadas
          top: assetPositions[asset.id]?.y || 0,   // Aquí también
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
          textAlign: 'center',
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={`http://localhost:5000/${asset.Fotografia}`}
            alt={`Imagen del activo ${asset.NumeroPlaca}`}
            style={{ width: '50px', height: '50px', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              padding: '2px 5px',
              fontSize: '10px',
              borderRadius: '3px',
            }}
          >
            {`Placa: ${asset.NumeroPlaca}`}
          </div>
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              backgroundColor: 'rgba(255, 0, 0, 0.7)',
              color: 'white',
              padding: '2px 5px',
              fontSize: '10px',
              borderRadius: '3px',
            }}
          >
            {`#${index + 1}`}
          </div>
        </div>
      </div>
    );
  };
  

  type DraggedItem = {
    id: number;
  };

  const MapDropArea = () => {
    const [, drop] = useDrop(() => ({
      accept: 'asset',
      drop: (item: DraggedItem, monitor) => handleDrop(item, monitor),
    }));

    return (
      <div
        ref={drop}
        style={{
          position: 'relative',
          width: '100%',
          height: '500px',
        }}
      >
        {/* Verificar si hay una URL de imagen válida y mostrar la imagen */}
        {zona && imageUrlMap && imageUrlMap.get(zona.id)?.get('ImagenMapa') && (
          <img
            src={imageUrlMap.get(zona.id)?.get('ImagenMapa') || ''}
            alt="Mapa de la Zona"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
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
              <Typography variant="h5" gutterBottom>
                Detalles de la Zona
              </Typography>
              {zona && (
                <Typography variant="body1" gutterBottom>
                  Número Zona: {zona.numeroZona} |
                  Nombre de la Zona: {zona.nombreZona} |
                  Responsable: {zona.responsableAreaNom_user} 
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Activos en el Mapa
              </Typography>
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
                  <TableCell>Descripción</TableCell>
                  <TableCell>Número de Placa</TableCell>
                  <TableCell>Esatdo</TableCell>
                  <TableCell>Posición X</TableCell>
                  <TableCell>Posición Y</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((asset, index) => (
                    <TableRow key={asset.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{asset.Descripcion}</TableCell>
                      <TableCell>{asset.NumeroPlaca}</TableCell>
                      <TableCell>{asset.Estado}</TableCell>
                      <TableCell>{assetPositions[asset.id]?.x || 'No Posicionada'}</TableCell>
                      <TableCell>{assetPositions[asset.id]?.y || 'No Posicionada'}</TableCell>
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
          <Button variant="contained" color="primary" onClick={saveAssetPositions}>
            Guardar Posiciones
          </Button>
        </Grid>
      </Grid>
    </DndProvider>
  );
}
