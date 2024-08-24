import {
  TableContainer, Paper, Table, TableCell, TableHead,
  TableRow, TableBody, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, TablePagination,
  FormControl, InputLabel, Select, MenuItem,
  TextField,
  FormHelperText,
  Grid,
  styled
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

interface Props {
  newAssets: newAssetModels[];
  setNewAssets: React.Dispatch<React.SetStateAction<newAssetModels[]>>;
}

function NewAssetsList({ newAssets, setNewAssets }: Props) {
  const [accountingAccounts, setAccountingAccounts] = useState<accountingAccount[]>([]);
  const [zones, setZones] = useState<Zona[]>([]);
  const [serviceLives, setServiceLives] = useState<serviceLifeModels[]>([]);
  const [statuses, setStatuses] = useState<statusAssets[]>([]);

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

  const handleAddNewAsset = async (newAsset: newAssetModels) => {
    try {
      await api.newAsset.saveNewAsset(newAsset);
      toast.success("Nuevo Activo Agregado");
      setOpenAddDialog(false);
      loadNewAsset();
    } catch (error) {
      console.error("Error al agregar nuevo activo:", error);
      toast.error("Error al intentar agregar nuevo activo");
    }
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
  const generateWord = async (assetId: number, numBoleta: string) => {
    try {
      const response = await api.newAsset.generateWordFile(assetId);
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, `asset_${numBoleta}.docx`);
    } catch (error) {
      console.error('Error generando Word:', error);
      toast.error('Error generando Word');
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddDialog(true)}
      >
        Agregar Nuevo Activo
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Codigo Cuenta</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Zona</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Tipo</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Estado</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Descripción</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Numero Placa</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Valor Compra CRC</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Valor Compra USD</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Fotografía</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Nombre Proveedor</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Fecha Compra</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Numero Factura</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Factura Imagen</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Orden Compra Numero</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Orden Compra Imagen</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Numero Asiento</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Numero Boleta</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Usuario</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Acciones</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Imprimir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newAssets.slice(startIndex, endIndex).map((newAsset) => (
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
                  ) : 'No Image'}
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
                      Ver Factura
                    </a>
                  ) : 'Sin Documento'}
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
                        Ver Orden
                      </a>
                  ) : 'Sin Documento'}
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
                    Editar
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
                    Eliminar
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

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Agregar Nuevo Activo</DialogTitle>
        <DialogContent>
          <RegisterAsset></RegisterAsset>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Activo</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="codigo-label">Codigo Cuenta</InputLabel>
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
            <InputLabel id="Zona-label">Zona</InputLabel>
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
            <InputLabel id="tipo-label">Tipo</InputLabel>
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
            <InputLabel id="Estado-label">Estado</InputLabel>
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
            label="Descripción"
            value={newAsset.Descripcion}
            onChange={(e) => setNewAsset({ ...newAsset, Descripcion: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Número Placa"
            value={newAsset.NumeroPlaca}
            onChange={(e) => setNewAsset({ ...newAsset, NumeroPlaca: +e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Valor Compra CRC"
            value={newAsset.ValorCompraCRC}
            onChange={(e) => setNewAsset({ ...newAsset, ValorCompraCRC: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Valor Compra USD"
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
            {newAsset.Fotografia? 'Cambiar Imagen de Fotografia' : 'Subir Imagen de Fotografia'}
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
            {newAsset.Fotografia && <FormHelperText>Archivo cargado: {newAsset.Fotografia.name}</FormHelperText>}
            {imageUrlMap1.get(newAsset.Fotografia?.name || '') && (
              <img src={imageUrlMap1.get(newAsset.Fotografia?.name || '')} alt="Fotografía" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            )}
          </Grid>

          <TextField
            label="Nombre Proveedor"
            value={newAsset.NombreProveedor}
            onChange={(e) => setNewAsset({ ...newAsset, NombreProveedor: e.target.value })}
            fullWidth
            margin="dense"
          />
          
          <TextField
            label="Fecha Compra"
            type="date"
            value={selectedNewAsset?.FechaCompra}
            

            onChange={(e) => setNewAsset({ ...newAsset, FechaCompra: new Date(e.target.value) })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Número Factura"
            value={newAsset.FacturaNum}
            onChange={(e) => setNewAsset({ ...newAsset, FacturaNum: +e.target.value })}
            fullWidth
            margin="dense"
          />
          <Grid item xs={6}>
            Imagen Actual:
          {newAsset.Fotografia && (
        <img src={imageUrlMap.get(newAsset.id || 0)?.get('FacturaImagen')} alt="Fotografía del Activo" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
      )}
            <Button variant="contained" component="label" fullWidth>
              Subir Imagen de Factura
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
            {newAsset.FacturaImagen && <FormHelperText>Archivo cargado: {newAsset.FacturaImagen.name}</FormHelperText>}
            {imageUrlMap1.get(newAsset.FacturaImagen?.name || '') && (
              <img src={imageUrlMap1.get(newAsset.FacturaImagen?.name || '')} alt="FacturaImg" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            )}
          </Grid>
          <TextField
            label="Ordén De Comprá"
            value={newAsset.OrdenCompraNum}
            onChange={(e) => setNewAsset({ ...newAsset, OrdenCompraNum: +e.target.value })}
            fullWidth
            margin="dense"
          />
           <Grid item xs={6}>
           {newAsset.Fotografia && (
        <img src={imageUrlMap.get(newAsset.id || 0)?.get('OrdenCompraImagen')} alt="Imagen de Orden de Compra" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
      )}
            <Button variant="contained" component="label" fullWidth>
              Subir Imagen de Factura
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
              {newAsset.OrdenCompraImagen && <FormHelperText>Archivo cargado: {newAsset.OrdenCompraImagen.name}</FormHelperText>}
              {imageUrlMap1.get(newAsset.OrdenCompraImagen?.name || '') && (
                <img src={imageUrlMap1.get(newAsset.OrdenCompraImagen?.name || '')} alt="OrdemCompImgen" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              )}
          </Grid>
          <TextField
            label="Número Asiento"
            value={newAsset.NumeroAsiento}
            onChange={(e) => setNewAsset({ ...newAsset, NumeroAsiento: +e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Número Boleta"
            value={newAsset.NumeroBoleta}
            onChange={(e) => setNewAsset({ ...newAsset, NumeroBoleta: e.target.value })}
            fullWidth
            margin="dense"
            disabled={true}
          />
          <TextField
            label="Usuario"
            value={newAsset.Usuario}
            onChange={(e) => setNewAsset({ ...newAsset, Usuario: e.target.value })}
            fullWidth
            margin="dense"
            disabled={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdateAsset}>Actualizar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)}>
        <DialogTitle>Detalles del Activo</DialogTitle>
        <DialogContent>
          <div>
            <p><strong>Código Cuenta:</strong> {selectedNewAsset?.CodigoCuenta}</p>
            <p><strong>Zona:</strong> {selectedNewAsset?.Zona}</p>
            <p><strong>Tipo:</strong> {selectedNewAsset?.Tipo}</p>
            <p><strong>Estado:</strong> {selectedNewAsset?.Estado}</p>
            <p><strong>Descripción:</strong> {selectedNewAsset?.Descripcion}</p>
            <p><strong>Número Placa:</strong> {selectedNewAsset?.NumeroPlaca}</p>
            <p><strong>Valor Compra CRC:</strong> {selectedNewAsset?.ValorCompraCRC}</p>
            <p><strong>Valor Compra USD:</strong> {selectedNewAsset?.ValorCompraUSD}</p>
            {imageUrlMap.get(selectedNewAsset?.id || 0)?.get('Fotografia') && (
              <p>
                <strong>Fotografía:</strong>
                <img
                  src={imageUrlMap.get(selectedNewAsset?.id || 0)?.get('Fotografia')}
                  alt="Fotografía del Activo"
                  style={{ width: 550, height: 550 }}
                />
              </p>
            )}
            <p><strong>Nombre Proveedor:</strong> {selectedNewAsset?.NombreProveedor}</p>
            <p><strong>Fecha Compra:</strong> {selectedNewAsset?.FechaCompra ? new Date(selectedNewAsset.FechaCompra).toLocaleDateString() : 'N/A'}</p>

            <p><strong>Número Factura:</strong> {selectedNewAsset?.FacturaNum}</p>
            {imageUrlMap.get(selectedNewAsset?.id || 0)?.get('FacturaImagen') && (
              <p>
                <strong>Factura:</strong>
                <img
                  src={imageUrlMap.get(selectedNewAsset?.id || 0)?.get('FacturaImagen')}
                  alt="Factura"
                  style={{ width: 550, height: 550 }}
                />
              </p>
            )}
            <p><strong>Número Orden de Compra:</strong> {selectedNewAsset?.OrdenCompraNum}</p>
            {imageUrlMap.get(selectedNewAsset?.id || 0)?.get('OrdenCompraImagen') && (
              <p>
                <strong>Orden de Compra:</strong>
                
                <img
                  src={imageUrlMap.get(selectedNewAsset?.id || 0)?.get('OrdenCompraImagen')}
                  alt="Imagen de Orden de Compra"
                  style={{ width: 550, height: 550 }}
                />
              </p>
            )}
            <p><strong>Número Asiento:</strong> {selectedNewAsset?.NumeroAsiento}</p>
            <p><strong>Número Boleta:</strong> {selectedNewAsset?.NumeroBoleta}</p>
            <p><strong>Usuario:</strong> {selectedNewAsset?.Usuario}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewAssetsList;