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
  const [imageUrlMap, setImageUrlMap] = useState<Map<number, Map<string, string>>>(new Map());  // Cambiamos el tipo
  const [assetPositions, setAssetPositions] = useState<{ [key: string]: { x: number; y: number } }>({});

  useEffect(() => {
    const loadZona = async () => {
      try {
        setLoading(true);
        const response = await api.Zones.getZonaById(parseInt(id as string));
        setZona(response.data);

        // Convertir la imagen del mapa a URL
        if (response.data.ImagenMapa) {
          convertImagesToDataUrl([response.data]);
        }

        const assetsResponse = await api.newAsset.searchAssetsByZona(response.data.nombreZona);
        setAssets(assetsResponse.data);
        console.log("Activos obtenidos por zona:", response.data);
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

          console.log("URLMAP: "+imageUrl);
          console.log("mapaZona: "+mapaZona.get('ImagenMapa'));

          mapaZona.set('ImagenMapa', imageUrl);
          return new Map(prevMap).set(zona.id, mapaZona);
        });
      }
    });
  };


  const handlePageChange = (event: unknown, newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => setRowsPerPage(parseInt(event.target.value, 10));

  const handleDrop = (item: DraggedItem, monitor: any) => {
    const delta = monitor.getDifferenceFromInitialOffset();
    const x = (assetPositions[item.id]?.x || 0) + delta.x;
    const y = (assetPositions[item.id]?.y || 0) + delta.y;
    setAssetPositions({ ...assetPositions, [item.id]: { x, y } });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  const AssetIcon = ({ asset }: { asset: newAssetModels }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'asset',
      item: { id: asset.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
    
    return (
      <div
        ref={drag}
        style={{
          position: 'absolute',
          left: assetPositions[asset.id]?.x || 0,
          top: assetPositions[asset.id]?.y || 0,
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
        }}
      >   
        {/* Muestra la imagen del activo  */}
        <img
         src={`http://localhost:5000/${asset.Fotografia}`}
         alt={`Imagen del activo ${asset.NumeroPlaca}`}
         style={{ width: '50px', height: '50px' }}
        />
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
          backgroundImage: zona && imageUrlMap && imageUrlMap.get(zona.id)?.get('ImagenMapa') 
            ? `url(http://localhost:5000/uploads/Mapas/1725857631333-zona1.png)` : 'http://localhost:5000/uploads/Mapas/1725857631333-zona1.png',  //datos quemados, 
            //`url(${imageUrlMap.get(zona.id)?.get('ImagenMapa')})`: "none", // Verifica si 'zona' no es null y si la imagen está cargada, esto no me lo esta mostrando 
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {assets.map((asset) => (
          <AssetIcon key={asset.id} asset={asset} />
        ))}
      </div>
    );
  };  

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ padding: 2, marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Detalles de la Zona
              </Typography>
              <Typography variant="h6">Nombre de la Zona: {zona?.nombreZona}</Typography>
              <Typography variant="h6">Número de Zona: {zona?.numeroZona}</Typography>
              <Typography variant="h6">Responsable: {zona?.responsableAreaNom_user}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Activos Relacionados:
          </Typography>
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
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Mapa de la Zona:
          </Typography>
          <MapDropArea />
        </Grid>
      </Grid>
    </DndProvider>
  );
}
