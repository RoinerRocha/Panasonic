import {
    TableContainer, Paper, Table, TableCell, TableHead,
    TableRow, TableBody, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, TablePagination,
    FormControl, InputLabel, Select, MenuItem,
    TextField,
    FormHelperText,
    Grid,
    styled, Box
} from "@mui/material";
import { assetSaleModel } from "../../app/models/assetSaleModel";
import { newAssetModels } from "../../app/models/newAssetModels";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { confirmAlert } from 'react-confirm-alert';
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';
import { SelectChangeEvent } from "@mui/material";
import api from "../../app/api/api";
import 'react-confirm-alert/src/react-confirm-alert.css';
import * as XLSX from 'xlsx';
import RegisterAsset from "./salesAssestFrm"

interface Props {
    assetSales: assetSaleModel[];
    setAssetSales: React.Dispatch<React.SetStateAction<assetSaleModel[]>>;
}

function AssetSalesList({assetSales, setAssetSales }: Props) {
  const { t } = useTranslation();
  const { changeLanguage, language } = useLanguage();
  const [assets, setAssets] = useState<newAssetModels[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<assetSaleModel[]>(assetSales);
  const [selectedNewAsset, setSelectedNewAsset] = useState<assetSaleModel | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<assetSaleModel>>({
    PlacaActivo: "",
    Descripcion: "",
    MontoVentas: 0,
    CotizacionVentas: null,
    DocumentoAprobado: null,
    Fotografia: null,
    Comprobante: null,
    NumeroBoleta: "",
    Usuario: "",
  });

  const [imageUrlMap, setImageUrlMap] = useState<Map<number, Map<string, string>>>(new Map());
  const { user } = useAppSelector(state => state.account);

  useEffect(() => {
    loadNewAsset();

    const fetchData = async () => {
      try {
        const [assetData] = await Promise.all([
          api.newAsset.getNewAssets()
        ]);
        
               // Se verifica que las respuestas sean arrays antes de actualizar el estado
               if (assetData && Array.isArray(assetData.data)) {
                setAssets(assetData.data);
              } else {
                console.error("User data is not an array", assetData);
              }
       
             } catch (error) {
               console.error("Error fetching data:", error);
               toast.error(t('TablaVentas-Toast-Error'));
             }
           };
       
    fetchData();
  }, []);

  const loadNewAsset: () => Promise<void> = async () => {
    try {
      const response = await api.salesAssest.getSalesAssets();
      setAssetSales(response.data);
      convertImagesToDataUrl(response.data);
    } catch (error) {
      console.error("Error al cargar Lista de Ventas de Activos:", error);
    }
  };
  
  
  /**
   * Metodo para conviertir los nombres de los archivos en URLs
   * @param assets 
   */
  const convertImagesToDataUrl = (assets: assetSaleModel[]) => {
    assets.forEach((asset) => {
      if (asset.Fotografia) {
        setImageUrlMap((prevMap) => {
          const assetMap = prevMap.get(asset.id) || new Map();
          const imageUrl = `http://localhost:5000/${asset.Fotografia}`;
          assetMap.set('Fotografia', imageUrl);
          return new Map(prevMap).set(asset.id, assetMap);
        });
      }
      if (asset.DocumentoAprobado) {
        setImageUrlMap((prevMap) => {
          const assetMap = prevMap.get(asset.id) || new Map();
          assetMap.set('DocumentoAprobado', `http://localhost:5000/${asset.DocumentoAprobado}`);
          return new Map(prevMap).set(asset.id, assetMap);
        });
      }
      if (asset.Comprobante) {
        setImageUrlMap((prevMap) => {
          const assetMap = prevMap.get(asset.id) || new Map();
          assetMap.set('Comprobante', `http://localhost:5000/${asset.Comprobante}`);
          return new Map(prevMap).set(asset.id, assetMap);
        });
      }
      if (asset.CotizacionVentas) {
        setImageUrlMap((prevMap) => {
          const assetMap = prevMap.get(asset.id) || new Map();
          assetMap.set('CotizacionVentas', `http://localhost:5000/${asset.CotizacionVentas}`);
          return new Map(prevMap).set(asset.id, assetMap);
        });
      }
    });
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    if (files && files.length > 0) {
      setNewAsset((prevAsset) => ({
        ...prevAsset,
        [name]: files[0],
      }));
    }
  };

  const handleDelete = (id: number) => {
    confirmAlert({
      title: t('Eliminacion-titulo'),
      message: t('Eliminacion-texto'),
      buttons: [
        {
          label: t('Eliminacion-botonSi'),
          onClick: async () => {
            try {
              await api.salesAssest.deleteSalesAsset(id);
              toast.success(t('TablaVentas-Toast-Eliminar'));
              
              // Actualiza directamente los estados después de la eliminación
              setAssetSales(prevAssetSales => 
                prevAssetSales.filter(asset => asset.id !== id)
              );
              setFilteredAssets(prevFilteredAssets =>
                prevFilteredAssets.filter(asset => asset.id !== id)
              );
            } catch (error) {
              console.error("Error al eliminar El Activo", error);
              toast.error(t('TablaVentas-Toast-EliminarError'));
            }
          }
        },
        {
          label: t('Eliminacion-botonNo'),
          onClick: () => { }
        }
      ]
    });
};

  const handleEdit = (newAsset: assetSaleModel) => {
    setSelectedNewAsset(newAsset);
    setNewAsset({...newAsset });
    setOpenEditDialog(true);
  };

  const handleUpdateAsset = async () => {
    if (selectedNewAsset) {
      try {
        const formData = new FormData();
  
        formData.append('PlacaActivo', newAsset.PlacaActivo?.toString() ?? '');
        formData.append('Descripcion', newAsset.Descripcion?.toString() ?? '');
        formData.append('MontoVentas', newAsset.MontoVentas?.toString() ?? '');
        if (newAsset.Fotografia) {
          formData.append('Fotografia', newAsset.Fotografia);
        }
        if (newAsset.CotizacionVentas) {
          formData.append('CotizacionVentas', newAsset.CotizacionVentas);
        }
        if (newAsset.Comprobante) {
          formData.append('Comprobante', newAsset.Comprobante);
        }
        if (newAsset.DocumentoAprobado) {
          formData.append('DocumentoAprobado', newAsset.DocumentoAprobado);
        }
  
        await api.salesAssest.updateSalesAsset(selectedNewAsset.id, formData);
        toast.success(t('TablaVentas-Toast-Editar'));
        setOpenEditDialog(false);
        // Actualizar el estado directamente
        setAssetSales((prevAssetSales) =>
          prevAssetSales.map((asset) =>
            asset.id === selectedNewAsset.id ? { ...asset, ...newAsset } : asset
          )
        );
        setFilteredAssets((prevFilteredAssets) =>
          prevFilteredAssets.map((asset) =>
            asset.id === selectedNewAsset.id ? { ...asset, ...newAsset } : asset
          )
        );
        loadNewAsset();
      } catch (error) {
        console.error("Error al actualizar El Activo:", error);
        toast.error(t('TablaVentas-Toast-EditarError'));
      }
    }
  };

  const handleZonaChange = (event: SelectChangeEvent<string | number>) => {
    const selectedZonaName = event.target.value;
  
    if (selectedZonaName === t('Lista-Filtro')) {
      setFilteredAssets(assetSales);  // Mostrar todos los activos
    } else {
      const filtered = assetSales.filter(asset => {
        // Comparar PlacaActivo como string
        return String(asset.PlacaActivo) === String(selectedZonaName);
      });
      setFilteredAssets(filtered);
    }
  
    setNewAsset(prev => ({
      ...prev,
      PlacaActivo: selectedZonaName // Asegurarse de que el valor seleccionado se guarde
    }));
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (newAsset: assetSaleModel) => {
    setSelectedNewAsset(newAsset);
    setOpenDetailDialog(true);
  };
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const [imageUrlMap1, setImageUrlMap1] = useState<Map<string, string>>(new Map());

  const generateExcelForAll = async () => {
    try {
        const data = filteredAssets.map(asset => ({
            "Placa Activo": asset.PlacaActivo,
            "Descripcion": asset.Descripcion,
            "Monto Ventas": asset.MontoVentas,
            "Fotografía": asset.Fotografia ? 'Con Imagen' : 'Sin Imagen',
            "Orden Compra Imagen": asset.DocumentoAprobado ? 'Aprobado' : 'Sin Aprobar',
            "Cotizacion de Ventas": asset.CotizacionVentas ? 'Con Cotizacion' : 'Sin Cotizacion',
            "Comprobante del Banco": asset.Comprobante ? 'Con comprobante' : 'Sin comprobante',
            "Numero Boleta": asset.NumeroBoleta,
            "Usuario": asset.Usuario
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Assets");

        const currentDate = new Date().toISOString().split('T')[0];

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `AssetSales_${currentDate}.xlsx`);
    } catch (error) {
        console.error("Error generando Excel:", error);
        toast.error(t('TablaVentas-Toast-ErrorExcel'));
    }
  };

  const generateExcel = async (assetId: number, numBoleta: string) => {
    try {
      const response = await api.salesAssest.generateExcelFile(assetId);
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `asset_${numBoleta}.xlsx`);
    } catch (error) {
      console.error('Error generando Excel:', error);
      toast.error(t('TablaVentas-Toast-ErrorExcel'));
    }
  };

  return (
    <div>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddDialog(true)}
        >
          {t('Ventas-titulo')}
        </Button>
      </Box>
      <FormControl fullWidth>
        <InputLabel id="zona-label">{t('TablaVentas-filtroTitulo')}</InputLabel>
        <Select
          labelId="zona-label"
          id="zona"
          value={String(newAsset.PlacaActivo)} // Convertir a string para asegurar la compatibilidad con el Select
          onChange={handleZonaChange}
          name="PlacaActivo"
          label="PlacaActivo"
        >
          <MenuItem value={t('Lista-Filtro')}>
            <em>{t('Lista-Filtro')}</em>
          </MenuItem>
          {assets.map((asset) => (
            <MenuItem key={asset.id} value={String(asset.NumeroPlaca)}> {/* Convertir NumeroPlaca a string */}
              {asset.NumeroPlaca}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{t('TablaVentas-filtroTitulo2')}</FormHelperText>
      </FormControl>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('TablaVentas-placa')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('TablaVentas-descripcion')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('TablaVentas-monto')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('TablaVentas-numero')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('TablaVentas-Usuario')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('TablaVentas-foto')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('TablaVentas-doc')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('TablaVentas-Cotizacion')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('TablaVentas-Comprobante')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('TablaVentas-ComprobanteVer')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('TablaVentas-Config')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssets.slice(startIndex, endIndex).map((newAsset) => (
              <TableRow key={newAsset.id} onClick={() => handleRowClick(newAsset)} style={{ cursor: "pointer" }}>
                <TableCell align="center">{newAsset.PlacaActivo}</TableCell>
                <TableCell align="center">{newAsset.Descripcion}</TableCell>
                <TableCell align="center">{newAsset.MontoVentas}</TableCell>
                <TableCell align="center">{newAsset.NumeroBoleta}</TableCell>
                <TableCell align="center">{newAsset.Usuario}</TableCell>
                <TableCell align="center">
                  {imageUrlMap.get(newAsset.id)?.get('Fotografia') ? (
                    <img
                      src={imageUrlMap.get(newAsset.id)?.get('Fotografia')}
                      alt="Fotografía"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ) : t('Lista-ErrorImagen')}
                </TableCell>
                <TableCell align="center">
                {imageUrlMap.get(newAsset.id)?.get('DocumentoAprobado') ? (
                    <a
                    href={imageUrlMap.get(newAsset.id)?.get('DocumentoAprobado')}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    onClick={(e) => e.stopPropagation()}
                    >
                    {t('TablaVentas-docVer')}
                    </a>
                ) : t('Lista-ErrorFactura')}
                </TableCell>
                <TableCell align="center">
                  {newAsset.CotizacionVentas ? (
                     <a
                      href={`http://localhost:5000/${newAsset.CotizacionVentas}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('TablaVentas-CotizacionVer')}
                    </a>
                  ) : t('Lista-ErrorFactura')}
                </TableCell>
                <TableCell align="center">
                  {newAsset.Comprobante ? (
                     <a
                      href={`http://localhost:5000/${newAsset.Comprobante}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('TablaVentas-ComprobanteVer')}
                    </a>
                  ) : t('Lista-ErrorFactura')}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="info"
                    sx={{ margin: "5px" }}
                    onClick={(event) => {
                      event.stopPropagation(); // Prevenir que el clic propague y abra el diálogo de detalles
                      handleEdit(newAsset);
                    }}
                  >
                    {t('Lista-BotonEditar')}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ margin: "5px" }}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(newAsset.id);
                    }}
                  >
                    {t('Lista-BotonEliminar')}
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ margin: "5px" }}
                    onClick={(event) => {
                      event.stopPropagation();
                      generateExcel(newAsset.id, newAsset.NumeroBoleta);
                    }}
                  >
                    Excel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={setAssetSales.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Button
          variant="contained"
          color="success"
          sx={{ margin: "10px" }}
          onClick={(event) => {
            event.stopPropagation();
            generateExcelForAll(); 
        }}
      >
          {t('TablaVentas-Boton')}
      </Button>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>{t('Ventas-titulo')}</DialogTitle>
        <DialogContent>
          <RegisterAsset></RegisterAsset>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>{t('Lista-BotonCancelar')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>{t('EditarVentas-titulo')}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="placa-label">{t('TablaVentas-placa')}</InputLabel>
            <Select
              labelId="placa-label"
              id="placa"
              label="PlacaActivo"
              value={newAsset.PlacaActivo}
              onChange={(e) =>  setNewAsset({ ...newAsset, PlacaActivo: +e.target.value})}
            >
            {assets.map((asset) => (
              <MenuItem key={asset.id} value={asset.NumeroPlaca}>
                {asset.NumeroPlaca}
              </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={t('TablaVentas-descripcion')}
            value={newAsset.Descripcion}
            onChange={(e) => setNewAsset({ ...newAsset, Descripcion: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label={t('TablaVentas-monto')}
            value={newAsset.MontoVentas}
            onChange={(e) => setNewAsset({ ...newAsset, MontoVentas: +e.target.value })}
            fullWidth
            margin="dense"
          />
          <Grid item xs={6}>
          {newAsset.Fotografia && (
        <img src={imageUrlMap.get(newAsset.id || 0)?.get('Fotografia')} alt={t('TablaVentas-foto')} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
      )}
            <Button variant="contained" component="label" fullWidth>
            {newAsset.Fotografia? t('EditarLista-BotonFotografia') : t('EditarLista-BotonFotografia')}
              <VisuallyHiddenInput
                type="file"
                name="ImagenFotografia"
                onChange={(e) => {
                  const file = e.target.files?.[0];  // Obtener el primer archivo seleccionado
                  if (file) {
                    const fileUrl = URL.createObjectURL(file); // Crear una URL temporal para el archivo
                    
                    setNewAsset({ ...newAsset, Fotografia: file });
                    setImageUrlMap1(prevMap => new Map(prevMap).set(file.name, fileUrl));
                  }
                }}
              />
            </Button> 
            {newAsset.Fotografia && <FormHelperText>{t('EditarLista-TituloArchivo')}: {newAsset.Fotografia.name}</FormHelperText>}
            {imageUrlMap1.get(newAsset.Fotografia?.name || '') && (
              <img src={imageUrlMap1.get(newAsset.Fotografia?.name || '')} alt={t('TablaVentas-foto')} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            )}
          </Grid>

          <Grid item xs={6}>
          {newAsset.Comprobante && (
        <img src={imageUrlMap.get(newAsset.id || 0)?.get('Comprobante')} alt={t('TablaVentas-Comprobante')} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
      )}
            <Button variant="contained" component="label" fullWidth>
            {newAsset.Comprobante? t('EditarVentas-Comprobante'): t('EditarVentas-Comprobante')}
              <VisuallyHiddenInput
                type="file"
                name="ImagenComprobante"
                onChange={(e) => {
                  const file = e.target.files?.[0];  // Obtener el primer archivo seleccionado
                  if (file) {
                    const fileUrl = URL.createObjectURL(file); // Crear una URL temporal para el archivo
                    
                    setNewAsset({ ...newAsset, Comprobante: file });
                    setImageUrlMap1(prevMap => new Map(prevMap).set(file.name, fileUrl));
                  }
                }}
              />
            </Button> 
            {newAsset.Comprobante && <FormHelperText>{t('EditarLista-TituloArchivo')}: {newAsset.Comprobante.name}</FormHelperText>}
            {imageUrlMap1.get(newAsset.Comprobante?.name || '') && (
              <img src={imageUrlMap1.get(newAsset.Comprobante?.name || '')} alt={t('TablaVentas-Comprobante')} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            )}
          </Grid>
          <Grid item xs={6}>
          {newAsset.CotizacionVentas && (
        <img src={imageUrlMap.get(newAsset.id || 0)?.get('CotizacionVentas')} alt={t('TablaVentas-Cotizacion')} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
      )}
            <Button variant="contained" component="label" fullWidth>
            {newAsset.CotizacionVentas? t('EditarVentas-Cotizacion'): t('EditarVentas-Cotizacion')}
              <VisuallyHiddenInput
                type="file"
                name="ImagenCotizacion"
                onChange={(e) => {
                  const file = e.target.files?.[0];  // Obtener el primer archivo seleccionado
                  if (file) {
                    const fileUrl = URL.createObjectURL(file); // Crear una URL temporal para el archivo
                    
                    setNewAsset({ ...newAsset, CotizacionVentas: file });
                    setImageUrlMap1(prevMap => new Map(prevMap).set(file.name, fileUrl));
                  }
                }}
              />
            </Button> 
            {newAsset.CotizacionVentas && <FormHelperText>{t('EditarLista-TituloArchivo')}: {newAsset.CotizacionVentas.name}</FormHelperText>}
            {imageUrlMap1.get(newAsset.CotizacionVentas?.name || '') && (
              <img src={imageUrlMap1.get(newAsset.CotizacionVentas?.name || '')} alt={t('TablaVentas-Cotizacion')} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            )}
          </Grid>
          <Grid item xs={6}>
          {newAsset.DocumentoAprobado && (
        <img src={imageUrlMap.get(newAsset.id || 0)?.get('DocumentoAprobado')} alt={t('TablaVentas-doc')} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
      )}
            <Button variant="contained" component="label" fullWidth>
            {newAsset.DocumentoAprobado? t('EditarVentas-Documento') : t('EditarVentas-Documento')}
              <VisuallyHiddenInput
                type="file"
                name="ImagenDocumentoAprobado"
                onChange={(e) => {
                  const file = e.target.files?.[0];  // Obtener el primer archivo seleccionado
                  if (file) {
                    const fileUrl = URL.createObjectURL(file); // Crear una URL temporal para el archivo
                    
                    setNewAsset({ ...newAsset, DocumentoAprobado: file });
                    setImageUrlMap1(prevMap => new Map(prevMap).set(file.name, fileUrl));
                  }
                }}
              />
            </Button> 
            {newAsset.DocumentoAprobado && <FormHelperText>{t('EditarLista-TituloArchivo')}: {newAsset.DocumentoAprobado.name}</FormHelperText>}
            {imageUrlMap1.get(newAsset.DocumentoAprobado?.name || '') && (
              <img src={imageUrlMap1.get(newAsset.DocumentoAprobado?.name || '')} alt={t('TablaVentas-doc')} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            )}
          </Grid>
          <TextField
            label={t('EditarLista-TituloBoleta')}
            value={newAsset.NumeroBoleta}
            onChange={(e) => setNewAsset({ ...newAsset, NumeroBoleta: e.target.value })}
            fullWidth
            margin="dense"
            disabled={true}
          />
          <TextField
            label={t('EditarLista-TituloUsuario')}
            value={newAsset.Usuario}
            onChange={(e) => setNewAsset({ ...newAsset, Usuario: e.target.value })}
            fullWidth
            margin="dense"
            disabled={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>{t('EditarLista-BotonCancelar')}</Button>
          <Button onClick={handleUpdateAsset}>{t('EditarLista-BotonEditar')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)}>
        <DialogTitle>{t('DetallesVentas-titulo')}</DialogTitle>
        <DialogContent>
          <div>
            <p><strong>{t('TablaVentas-placa')}: </strong> {selectedNewAsset?.PlacaActivo}</p>
            <p><strong>{t('TablaVentas-descripcion')}: </strong> {selectedNewAsset?.Descripcion}</p>
            <p><strong>{t('TablaVentas-monto')}: </strong> {selectedNewAsset?.MontoVentas}</p>
            {imageUrlMap.get(selectedNewAsset?.id || 0)?.get('Fotografia') && (
              <p>
                <strong>{t('DetallesLista-Fotografia')}:</strong>
                <img
                  src={imageUrlMap.get(selectedNewAsset?.id || 0)?.get('Fotografia')}
                  alt="Fotografía del Activo"
                  style={{ width: 550, height: 550 }}
                />
              </p>
            )}
            {imageUrlMap.get(selectedNewAsset?.id || 0)?.get('DocumentoAprobado') && (
              <p>
                <strong>{t('DetallesVentas-DetalleDoc')}: </strong>
                <a
                  href={imageUrlMap.get(selectedNewAsset?.id || 0)?.get('DocumentoAprobado')}
                  download="OrdenCompra"
                >
                  {t('AgregarActivo-Ver Documento')}
                </a>
              </p>
            )}
             {imageUrlMap.get(selectedNewAsset?.id || 0)?.get('CotizacionVentas') && (
              <p>
                <strong>{t('DetallesVentas-DetalleCoti')}: </strong>
                <a
                  href={imageUrlMap.get(selectedNewAsset?.id || 0)?.get('CotizacionVentas')}
                  download="CotizacionVentas"
                >
                  {t('AgregarActivo-Ver Documento')}
                </a>
              </p>
            )}
            {imageUrlMap.get(selectedNewAsset?.id || 0)?.get('Comprobante') && (
              <p>
                <strong>{t('DetallesVentas-DetalleComp')}: </strong>
                <a
                  href={imageUrlMap.get(selectedNewAsset?.id || 0)?.get('Comprobante')}
                  download="Comprobante"
                >
                  {t('AgregarActivo-Ver Documento')}
                </a>
              </p>
            )}
            <p><strong>{t('DetallesLista-TituloBoleta')}:</strong> {selectedNewAsset?.NumeroBoleta}</p>
            <p><strong>{t('DetallesLista-TituloUsuario')}:</strong> {selectedNewAsset?.Usuario}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>{t('DetallesLista-BotonCancelar')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default AssetSalesList;
