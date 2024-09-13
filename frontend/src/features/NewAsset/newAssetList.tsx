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
import { newAssetModels } from "../../app/models/newAssetModels";
import { useState, useEffect } from "react";
import api from "../../app/api/api";
import { toast } from "react-toastify";
import RegisterAsset from "./registerAsset";
import { Zona } from "../../app/models/zone"; // Zonas
import { serviceLifeModels } from "../../app/models/serviceLifeModels"; // Tipos
import { statusAssets } from "../../app/models/statusAsset"; // Estados
import { accountingAccount } from "../../app/models/accountingAccount";
import { useAppSelector } from "../../store/configureStore";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Dataset } from "@mui/icons-material";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun } from "docx";
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';

import { SelectChangeEvent } from "@mui/material";

interface Props {
  newAssets: newAssetModels[];
  setNewAssets: React.Dispatch<React.SetStateAction<newAssetModels[]>>;
}

function NewAssetsList({ newAssets, setNewAssets }: Props) {
  const { t } = useTranslation();
  const { changeLanguage, language } = useLanguage();
  const [accountingAccounts, setAccountingAccounts] = useState<accountingAccount[]>([]);
  const [zones, setZones] = useState<Zona[]>([]);
  const [serviceLives, setServiceLives] = useState<serviceLifeModels[]>([]);
  const [statuses, setStatuses] = useState<statusAssets[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<newAssetModels[]>(newAssets);

  const [selectedNewAsset, setSelectedNewAsset] = useState<newAssetModels | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<newAssetModels>>({
    CodigoCuenta: 0,
    Zona: 0,
    Tipo: 0,
    Estado: 0,
    Descripcion: "",
    NumeroPlaca: 0,
    ValorCompraCRC: "",
    ValorCompraUSD: "",
    Fotografia: null,
    NombreProveedor: "",
    FechaCompra: new Date(),
    FacturaNum: 0,
    FacturaImagen: null,
    OrdenCompraNum: 0,
    OrdenCompraImagen: null,
    NumeroAsiento: 0,
    NumeroBoleta: "",
    Usuario: "",
  });

  const [imageUrlMap, setImageUrlMap] = useState<Map<number, Map<string, string>>>(new Map());
  const { user } = useAppSelector(state => state.account);

  useEffect(() => {
    loadNewAsset();

    const fetchData = async () => {
      try {
        const [zonesData, accountsData, serviceLifeData, statusData] = await Promise.all([
          api.Zones.getZona(),
          api.AcountingAccounts.getAccountingAccounts(),
          api.serviceLife.getServiceLifes(),
          api.statusAssets.getStatusAssets()
        ]);
        
               // Se verifica que las respuestas sean arrays antes de actualizar el estado
               if (zonesData && Array.isArray(zonesData.data)) {
                setZones(zonesData.data);
              } else {
                console.error("Zones data is not an array", zonesData);
              }
          
              if (accountsData && Array.isArray(accountsData.data)) {
                setAccountingAccounts(accountsData.data);
              } else {
                console.error("Accounting accounts data is not an array", accountsData);
              }
       
               if (serviceLifeData && Array.isArray(serviceLifeData.data)) {
                setServiceLives(serviceLifeData.data);
              } else {
                console.error("Service life data is not an array", serviceLifeData);
              }
       
               if (statusData && Array.isArray(statusData.data)) {
                setStatuses(statusData.data);
              } else {
                console.error("Status data is not an array", statusData);
              }
       
             } catch (error) {
               console.error("Error fetching data:", error);
               toast.error("Error al cargar datos");
             }
           };
       
    fetchData();
  }, []);

  const loadNewAsset: () => Promise<void> = async () => {
    try {
      const response = await api.newAsset.getNewAssets();
      setNewAssets(response.data);
      convertImagesToDataUrl(response.data);
    } catch (error) {
      console.error("Error al cargar Lista de Ingreso de Activos:", error);
    }
  };
  
  
  /**
   * Metodo para conviertir los nombres de los archivos en URLs
   * @param assets 
   */
  const convertImagesToDataUrl = (assets: newAssetModels[]) => {
    assets.forEach((asset) => {
      if (asset.Fotografia) {
        setImageUrlMap((prevMap) => {
          const assetMap = prevMap.get(asset.id) || new Map();
          const imageUrl = `http://localhost:5000/${asset.Fotografia}`;
          assetMap.set('Fotografia', imageUrl);
          return new Map(prevMap).set(asset.id, assetMap);
        });
      }
      if (asset.FacturaImagen) {
        setImageUrlMap((prevMap) => {
          const assetMap = prevMap.get(asset.id) || new Map();
          assetMap.set('FacturaImagen', `http://localhost:5000/${asset.FacturaImagen}`);
          return new Map(prevMap).set(asset.id, assetMap);
        });
      }
      if (asset.OrdenCompraImagen) {
        setImageUrlMap((prevMap) => {
          const assetMap = prevMap.get(asset.id) || new Map();
          assetMap.set('OrdenCompraImagen', `http://localhost:5000/${asset.OrdenCompraImagen}`);
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
      title: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este activo?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await api.newAsset.deleteNewAsset(id);
              toast.success("Activo Eliminado Correctamente");
              loadNewAsset();
            } catch (error) {
              console.error("Error al eliminar El Activo", error);
              toast.error("Error al eliminar El activo");
            }
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  };

  const handleEdit = (newAsset: newAssetModels) => {
    setSelectedNewAsset(newAsset);
    setNewAsset({...newAsset });
    setOpenEditDialog(true);
  };

  const handleUpdateAsset = async () => {
    if (selectedNewAsset) {
      try {
        const formData = new FormData();

        formData.append('CodigoCuenta', newAsset.CodigoCuenta?.toString() ?? '');
        formData.append('Zona', newAsset.Zona?.toString() ?? '');
        formData.append('Tipo', newAsset.Tipo?.toString() ?? '');
        formData.append('Estado', newAsset.Estado?.toString() ?? '');
        formData.append('Descripcion', newAsset.Descripcion ?? '');
        formData.append('NumeroPlaca', newAsset.NumeroPlaca?.toString() ?? '');
        formData.append('ValorCompraCRC', newAsset.ValorCompraCRC ?? '');
        formData.append('ValorCompraUSD', newAsset.ValorCompraUSD ?? '');
        if (newAsset.Fotografia) {
          formData.append('Fotografia', newAsset.Fotografia);
        }
        formData.append('NombreProveedor', newAsset.NombreProveedor ?? '');
        formData.append('FechaCompra', newAsset.FechaCompra?.toString() ?? '');
        formData.append('FacturaNum', newAsset.FacturaNum?.toString() ?? '');
        if (newAsset.FacturaImagen) {
          formData.append('FacturaImagen', newAsset.FacturaImagen);
        }
        formData.append('OrdenCompraNum', newAsset.OrdenCompraNum?.toString() ?? '');
        if (newAsset.OrdenCompraImagen) {
          formData.append('OrdenCompraImagen', newAsset.OrdenCompraImagen);
        }
        formData.append('NumeroAsiento', newAsset.NumeroAsiento?.toString() ?? '');
        formData.append('NumeroBoleta', newAsset.NumeroBoleta ?? '');
        formData.append('Usuario', newAsset.Usuario ?? '');


        await api.newAsset.updateNewAsset(selectedNewAsset.id, formData);
        toast.success("Activo Ingresado Actualizado");
        setOpenEditDialog(false);
        loadNewAsset();
      } catch (error) {
        console.error("Error al actualizar El Activo Ingresado:", error);
        toast.error("Error al intentar Actualizar Activo");
      }
    }
  };

  const handleZonaChange = (event: SelectChangeEvent<string | number>) => {
    const selectedZonaName = event.target.value as string;

    if (selectedZonaName === t('Lista-Filtro')) {
        // Si no se selecciona ninguna zona, mostrar todos los activos
        setFilteredAssets(newAssets);
    } else {
        // Filtrar activos por zona seleccionada
        const filtered = newAssets.filter(asset => asset.Zona === selectedZonaName);
        setFilteredAssets(filtered);
    }

    // También asegúrate de actualizar el estado del nuevo activo
    setNewAsset(prev => ({
        ...prev,
        Zona: selectedZonaName
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

  const handleRowClick = (newAsset: newAssetModels) => {
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

  const generatePDF = async (assetId: number, numBoleta: string) => {
    try {
      const response = await api.newAsset.generatePDFFile(assetId);
      const blob = new Blob([response], { type: 'application/pdf' });
      saveAs(blob, `asset_${numBoleta}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error generando PDF');
    }
  };

  const generateExcelForAll = async () => {
    try {
        const data = filteredAssets.map(asset => ({
            "Codigo Cuenta": asset.CodigoCuenta,
            "Zona": asset.Zona,
            "Tipo": asset.Tipo,
            "Estado": asset.Estado,
            "Descripción": asset.Descripcion,
            "Numero Placa": asset.NumeroPlaca,
            "Valor Compra CRC": asset.ValorCompraCRC,
            "Valor Compra USD": asset.ValorCompraUSD,
            "Fotografía": asset.Fotografia ? 'Con Imagen' : 'Sin Imagen',
            "Nombre Proveedor": asset.NombreProveedor,
            "Fecha Compra": new Date(asset.FechaCompra).toLocaleDateString(),
            "Numero Factura": asset.FacturaNum,
            "Factura Imagen": asset.FacturaImagen ? 'Con documento' : 'Sin Documento',
            "Orden Compra Numero": asset.OrdenCompraNum,
            "Orden Compra Imagen": asset.OrdenCompraImagen ? 'Con documento' : 'Sin Documento',
            "Numero Asiento": asset.NumeroAsiento,
            "Numero Boleta": asset.NumeroBoleta,
            "Usuario": asset.Usuario
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Assets");

        const currentDate = new Date().toISOString().split('T')[0];

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `Assets_${currentDate}.xlsx`);
    } catch (error) {
        console.error("Error generando Excel:", error);
        toast.error("Error generando Excel");
    }
};

  const generateExcel = async (assetId: number, numBoleta: string) => {
    try {
      const response = await api.newAsset.generateExcelFile(assetId);
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `asset_${numBoleta}.xlsx`);
    } catch (error) {
      console.error('Error generando Excel:', error);
      toast.error('Error generando Excel');
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
          {t('Lista-BotonAgregar')}
        </Button>
      </Box>
      <FormControl fullWidth>
        <InputLabel id="zona-label">{t('Lista-ColumnaZona')}</InputLabel>
        <Select
            labelId="zona-label"
            id="zona"
            value={newAsset.Zona || ""}
            onChange={handleZonaChange}
            name="Zona"
            label="Zona"
        >
            <MenuItem value={t('Lista-Filtro')}>
                <em>{t('Lista-Filtro')}</em>
            </MenuItem>
            {zones.map((zona) => (
                <MenuItem key={zona.id} value={zona.nombreZona}>
                    {zona.nombreZona} 
                </MenuItem>
            ))}
        </Select>
        <FormHelperText>{t('Lista-FiltroTitulo')}</FormHelperText>
      </FormControl>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaCodigo')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaZona')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaTipo')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaEstado')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaDescripcion')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaPlaca')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaCRC')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaUSD')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaFotografia')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaProveedor')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaFecha')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaFactura')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaFacturaDoc')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaOrden')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaOrdenDoc')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaAsiento')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaBoleta')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaUsuario')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaConfiguracion')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{t('Lista-ColumnaReportes')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssets.slice(startIndex, endIndex).map((newAsset) => (
              <TableRow key={newAsset.id} onClick={() => handleRowClick(newAsset)} style={{ cursor: "pointer" }}>
                <TableCell>{newAsset.CodigoCuenta}</TableCell>
                <TableCell>{newAsset.Zona}</TableCell>
                <TableCell>{newAsset.Tipo}</TableCell>
                <TableCell>{newAsset.Estado}</TableCell>
                <TableCell>{newAsset.Descripcion}</TableCell>
                <TableCell>{newAsset.NumeroPlaca}</TableCell>
                <TableCell>{'₡' + newAsset.ValorCompraCRC}</TableCell>
                <TableCell>{"$" + newAsset.ValorCompraUSD}</TableCell>
                <TableCell>
                  {imageUrlMap.get(newAsset.id)?.get('Fotografia') ? (
                    <img
                      src={imageUrlMap.get(newAsset.id)?.get('Fotografia')}
                      alt="Fotografía"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ) : t('Lista-ErrorImagen')}
                </TableCell>
                <TableCell>{newAsset.NombreProveedor}</TableCell>
                <TableCell>{new Date(newAsset.FechaCompra).toLocaleDateString()}</TableCell>
                <TableCell>{newAsset.FacturaNum}</TableCell>
                <TableCell>
                  {newAsset.FacturaImagen ? (
                     <a
                      href={`http://localhost:5000/${newAsset.FacturaImagen}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('Lista-TextoFacturaDoc')}
                    </a>
                  ) : t('Lista-ErrorFactura')}
                </TableCell>
                <TableCell>{newAsset.OrdenCompraNum}</TableCell>
                <TableCell>
                  {newAsset.OrdenCompraImagen ? (
                      <a
                        href={`http://localhost:5000/${newAsset.OrdenCompraImagen}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t('Lista-TextoOrdenDoc')}
                      </a>
                  ) : t('Lista-ErrorOrden')}
                </TableCell>
                <TableCell>{newAsset.NumeroAsiento}</TableCell>
                <TableCell>{newAsset.NumeroBoleta}</TableCell>
                <TableCell>{newAsset.Usuario}</TableCell>
                <TableCell>
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
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ margin: "5px" }}
                    onClick={(event) => {
                      event.stopPropagation();
                      generatePDF(newAsset.id, newAsset.NumeroBoleta);
                    }}
                  >
                    PDF
                  </Button>
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
          count={newAssets.length}
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
          {t('Lista-BotonExcel')}
      </Button>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>{t('Lista-BotonAgregar')}</DialogTitle>
        <DialogContent>
          <RegisterAsset></RegisterAsset>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>{t('Lista-BotonCancelar')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>{t('EditarLista-Titulo')}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="codigo-label">{t('EditarLista-TituloCodigo')}</InputLabel>
            <Select
              labelId="codigo-label"
              id="codigo"
              label="Codigo Cuenta"
              value={newAsset.CodigoCuenta}
              onChange={(e) =>  setNewAsset({ ...newAsset, CodigoCuenta: +e.target.value})}
            >
            {accountingAccounts.map((account) => (
              <MenuItem key={account.id} value={account.codigoCuenta}>
                {account.codigoCuenta}
              </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="Zona-label">{t('EditarLista-TituloZona')}</InputLabel>
            <Select
              labelId="Zona-label"
              id="zona"
              label="Zona"
              value={newAsset.Zona}
              onChange={(e) =>  setNewAsset({ ...newAsset, Zona: e.target.value})}
            >
            {zones.map((zone) => (
              <MenuItem key={zone.id} value={zone.nombreZona}>
                {zone.nombreZona}
              </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="tipo-label">{t('EditarLista-TituloTipo')}</InputLabel>
            <Select
              labelId="tipo-label"
              id="tipo"
              label="Tipo"
              value={newAsset.Tipo}
              onChange={(e) =>  setNewAsset({ ...newAsset, Tipo: e.target.value})}
            >
            {serviceLives.map((service) => (
              <MenuItem key={service.id} value={service.tipo}>
                {service.tipo}
              </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="Estado-label">{t('EditarLista-TituloEstado')}</InputLabel>
            <Select
              labelId="Estado-label"
              id="estado"
              label="Tipo"
              value={newAsset.Estado}
              onChange={(e) =>  setNewAsset({ ...newAsset, Estado: e.target.value})}
            >
            {statuses.map((status) => (
              <MenuItem key={status.id} value={status.status}>
                {status.status}
              </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={t('EditarLista-TituloDescripcion')}
            value={newAsset.Descripcion}
            onChange={(e) => setNewAsset({ ...newAsset, Descripcion: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label={t('EditarLista-TituloPlaca')}
            value={newAsset.NumeroPlaca}
            onChange={(e) => setNewAsset({ ...newAsset, NumeroPlaca: +e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label={t('EditarLista-TituloCRC')}
            value={newAsset.ValorCompraCRC}
            onChange={(e) => setNewAsset({ ...newAsset, ValorCompraCRC: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label={t('EditarLista-TituloUSD')}
            value={selectedNewAsset?.ValorCompraUSD}
            onChange={(e) => setNewAsset({ ...newAsset, ValorCompraUSD: e.target.value })}
            fullWidth
            margin="dense"
          />
          <Grid item xs={6}>
          {newAsset.Fotografia && (
        <img src={imageUrlMap.get(newAsset.id || 0)?.get('Fotografia')} alt="Fotografía" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
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
              <img src={imageUrlMap1.get(newAsset.Fotografia?.name || '')} alt="Fotografía" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            )}
          </Grid>

          <TextField
            label={t('EditarLista-TituloProveedor')}
            value={newAsset.NombreProveedor}
            onChange={(e) => setNewAsset({ ...newAsset, NombreProveedor: e.target.value })}
            fullWidth
            margin="dense"
          />
          
          <TextField
            label={t('EditarLista-TituloFecha')}
            type="date"
            value={selectedNewAsset?.FechaCompra}
            

            onChange={(e) => setNewAsset({ ...newAsset, FechaCompra: new Date(e.target.value) })}
            fullWidth
            margin="dense"
          />
          <TextField
            label={t('EditarLista-TituloFactura')}
            value={newAsset.FacturaNum}
            onChange={(e) => setNewAsset({ ...newAsset, FacturaNum: +e.target.value })}
            fullWidth
            margin="dense"
          />
          <Grid item xs={6}>
          {newAsset.Fotografia && (
        <img src={imageUrlMap.get(newAsset.id || 0)?.get('FacturaImagen')} alt={t('AgregarActivo-Documento')} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
      )}
            <Button variant="contained" component="label" fullWidth>
              {t('EditarLista-BotonFacturaDoc')}
              <VisuallyHiddenInput
                type="file"
                name="FacturaImagen"
                onChange={(e) => {
                  const file = e.target.files?.[0];  // Obtener el primer archivo seleccionado
                  if (file) {
                    const fileUrl = URL.createObjectURL(file); // Crear una URL temporal para el archivo
                    setNewAsset({ ...newAsset, FacturaImagen: file });
                    setImageUrlMap1(prevMap => new Map(prevMap).set(file.name, fileUrl));
                  }
                }}
              />
            </Button> 
            {newAsset.FacturaImagen && <FormHelperText>{t('EditarLista-TituloArchivo')}: {newAsset.FacturaImagen.name}</FormHelperText>}
            {imageUrlMap1.get(newAsset.FacturaImagen?.name || '') && (
              <img src={imageUrlMap1.get(newAsset.FacturaImagen?.name || '')} alt="FacturaImg" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            )}
          </Grid>
          <TextField
            label={t('EditarLista-TituloOrden')}
            value={newAsset.OrdenCompraNum}
            onChange={(e) => setNewAsset({ ...newAsset, OrdenCompraNum: +e.target.value })}
            fullWidth
            margin="dense"
          />
           <Grid item xs={6}>
           {newAsset.Fotografia && (
        <img src={imageUrlMap.get(newAsset.id || 0)?.get('OrdenCompraImagen')} alt={t('AgregarActivo-Documento')} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
      )}
            <Button variant="contained" component="label" fullWidth>
              {t('EditarLista-BotonOrdenDoc')}
              <VisuallyHiddenInput
                type="file"
                name="OrdenCompImagen"
                  onChange={(e) => {
                    const file = e.target.files?.[0];  // Obtener el primer archivo seleccionado
                    if (file) {
                      const fileUrl = URL.createObjectURL(file); // Crear una URL temporal para el archivo
                      setNewAsset({ ...newAsset, OrdenCompraImagen: file });
                      setImageUrlMap1(prevMap => new Map(prevMap).set(file.name, fileUrl));
                    }
                  }}
                />
              </Button> 
              {newAsset.OrdenCompraImagen && <FormHelperText>{t('EditarLista-TituloArchivo')}: {newAsset.OrdenCompraImagen.name}</FormHelperText>}
              {imageUrlMap1.get(newAsset.OrdenCompraImagen?.name || '') && (
                <img src={imageUrlMap1.get(newAsset.OrdenCompraImagen?.name || '')} alt="OrdemCompImgen" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              )}
          </Grid>
          <TextField
            label={t('EditarLista-TituloAsiento')}
            value={newAsset.NumeroAsiento}
            onChange={(e) => setNewAsset({ ...newAsset, NumeroAsiento: +e.target.value })}
            fullWidth
            margin="dense"
          />
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
        <DialogTitle>{t('DetallesLista-Titulo')}</DialogTitle>
        <DialogContent>
          <div>
            <p><strong>{t('DetallesLista-TituloCodigo')}:</strong> {selectedNewAsset?.CodigoCuenta}</p>
            <p><strong>{t('DetallesLista-TituloZona')}:</strong> {selectedNewAsset?.Zona}</p>
            <p><strong>{t('DetallesLista-TituloTipo')}:</strong> {selectedNewAsset?.Tipo}</p>
            <p><strong>{t('DetallesLista-TituloEstado')}:</strong> {selectedNewAsset?.Estado}</p>
            <p><strong>{t('DetallesLista-TituloDescripcion')}:</strong> {selectedNewAsset?.Descripcion}</p>
            <p><strong>{t('DetallesLista-TituloPlaca')}:</strong> {selectedNewAsset?.NumeroPlaca}</p>
            <p><strong>{t('DetallesLista-TituloCRC')}:</strong> {selectedNewAsset?.ValorCompraCRC}</p>
            <p><strong>{t('DetallesLista-TituloUSD')}:</strong> {selectedNewAsset?.ValorCompraUSD}</p>
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
            <p><strong>{t('DetallesLista-TituloProveedor')}:</strong> {selectedNewAsset?.NombreProveedor}</p>
            <p><strong>{t('DetallesLista-TituloFecha')}:</strong> {selectedNewAsset?.FechaCompra ? new Date(selectedNewAsset.FechaCompra).toLocaleDateString() : 'N/A'}</p>

            <p><strong>{t('DetallesLista-TituloFactura')}:</strong> {selectedNewAsset?.FacturaNum}</p>
            {imageUrlMap.get(selectedNewAsset?.id || 0)?.get('FacturaImagen') && (
              <p>
                <strong>{t('DetallesLista-Factura')}:</strong>
                <a
                  href={imageUrlMap.get(selectedNewAsset?.id || 0)?.get('FacturaImagen')}
                  download="Factura"
                >
                  {t('AgregarActivo-Ver Documento')}
                </a>
              </p>
            )}
            <p><strong>{t('DetallesLista-TituloOrden')}:</strong> {selectedNewAsset?.OrdenCompraNum}</p>
            {imageUrlMap.get(selectedNewAsset?.id || 0)?.get('OrdenCompraImagen') && (
              <p>
                <strong>{t('DetallesLista-Orden')}:</strong>
                <a
                  href={imageUrlMap.get(selectedNewAsset?.id || 0)?.get('OrdenCompraImagen')}
                  download="OrdenCompra"
                >
                  {t('AgregarActivo-Ver Documento')}
                </a>
              </p>
            )}
            <p><strong>{t('DetallesLista-TituloAsiento')}:</strong> {selectedNewAsset?.NumeroAsiento}</p>
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
};

export default NewAssetsList;