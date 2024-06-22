import {
  Grid,
  TableContainer,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TablePagination,
  Card,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import { newAssetModels } from "../../app/models/newAssetModels";
import { useState, useEffect } from "react";
import api from "../../app/api/api";
import { toast } from "react-toastify";
import { Buffer } from 'buffer';
import RegisterAsset from "./registerAsset";

interface Props {
  newAssets: newAssetModels[];
  setNewAssets: React.Dispatch<React.SetStateAction<newAssetModels[]>>;
}

function bufferToDataUrl(buffer: ArrayBuffer | Uint8Array, mimeType: string): string {
  let uint8Array: Uint8Array;
  if (buffer instanceof ArrayBuffer) {
    uint8Array = new Uint8Array(buffer);
  } else {
    uint8Array = buffer;
  }

  const binaryString = Array.prototype.map.call(uint8Array, (x) => String.fromCharCode(x)).join('');
  const base64String = btoa(binaryString);
  return `data:${mimeType};base64,${base64String}`;
}



export default function NewAssetsList({
  newAssets,
  setNewAssets,
}: Props) {
  const [selectedNewAsset, setSelectedNewAsset] =
    useState<newAssetModels | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
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

  useEffect(() => {
    loadNewAsset();
  }, []);

  const loadNewAsset = async () => {
    try {
      const response = await api.newAsset.getNewAssets();
      setNewAssets(response.data);
    } catch (error) {
      console.error("Error al cargar Lista de Ingreso de Activos:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.newAsset.deleteNewAsset(id);
      toast.success("Activo Ingresado Eliminado");
      loadNewAsset();
    } catch (error) {
      console.error("Error al eliminar El activo ingresado", error);
    }
  };

  const handleEdit = (newAsset: newAssetModels) => {
    setSelectedNewAsset(newAsset);
    setOpenEditDialog(true);
  };

  const handleUpdate = async () => {
    if (selectedNewAsset) {
      try {
        const newAssetId = selectedNewAsset.id;
        const updatedNewAsset = {
          CodigoCCuenta: selectedNewAsset.CodigoCuenta,
          Zona: selectedNewAsset.Zona,
          Tipo: selectedNewAsset.Tipo,
          Estado: selectedNewAsset.Estado,
          Descripcion: selectedNewAsset.Descripcion,
          NumeroPlaca: selectedNewAsset.NumeroPlaca,
          ValorCompraCRC: selectedNewAsset.ValorCompraCRC,
          ValorCompraUSD: selectedNewAsset.ValorCompraUSD,
          Fotografia: selectedNewAsset.Fotografia,
          NombreProveedor: selectedNewAsset.NombreProveedor,
          FechaCompra: selectedNewAsset.FechaCompra,
          FacturaNum: selectedNewAsset.FacturaNum,
          FacturaImagen: selectedNewAsset.FacturaImagen,
          OrdenCompraNum: selectedNewAsset.OrdenCompraNum,
          OrdenCompraImagen: selectedNewAsset.OrdenCompraImagen,
          NumeroAsiento: selectedNewAsset.NumeroAsiento,
          NumeroBoleta: selectedNewAsset.NumeroBoleta,
          Usuario: selectedNewAsset.Usuario,
        };
        await api.newAsset.updateNewAsset(newAssetId, updatedNewAsset);
        toast.success("Activo Ingresado Actualizado");
        setOpenEditDialog(false);
        loadNewAsset();
      } catch (error) {
        console.error("Error al actualizar El Activo Ingresado:", error);
      }
    }
  };

  const handleAdd = async () => {
    try {
      const addedStatusAsset = await api.newAsset.saveNewAsset(newAsset);
      toast.success("Activo Agregado");
      setOpenAddDialog(false);
      loadNewAsset();
    } catch (error) {
      console.error("Error al agregar El nuevo Activo:", error);
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProfiles = newAssets.slice(startIndex, endIndex);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {/* Column Headers */}
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Codigo Cuenta</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Zona</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Tipo</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Estado</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Descripción</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Numero Placa</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Valor Compra CRC</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Valor Compra USD</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Fotografia</TableCell>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProfiles.map((newAsset) => (
              <TableRow key={newAsset.id}>
                {/* Data Rows */}
                <TableCell>{newAsset.CodigoCuenta}</TableCell>
                <TableCell>{newAsset.Zona}</TableCell>
                <TableCell>{newAsset.Tipo}</TableCell>
                <TableCell>{newAsset.Estado}</TableCell>
                <TableCell>{newAsset.Descripcion}</TableCell>
                <TableCell>{newAsset.NumeroPlaca}</TableCell>
                <TableCell>{'₡'+newAsset.ValorCompraCRC}</TableCell>
                <TableCell>{"$"+newAsset.ValorCompraUSD}</TableCell>
                <TableCell>
                {newAsset.Fotografia ? (
                  
                    <>
                      {console.log('Tipo de Fotografia:', typeof newAsset.Fotografia)}
                      <img 
                        src={typeof newAsset.Fotografia === 'string' ? newAsset.Fotografia: bufferToDataUrl(newAsset.Fotografia,'image/png')} 
                        alt="Fotografia" 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </>
                 ) : 'No Image'}
                </TableCell>
                <TableCell>{newAsset.NombreProveedor}</TableCell>
                <TableCell>
                  {new Date(newAsset.FechaCompra).toLocaleDateString()}
                </TableCell>
                <TableCell>{newAsset.FacturaNum}</TableCell>
                <TableCell>
                {newAsset.FacturaImagen ? (
    <>
      {console.log('Tipo de FacturaImagen:', typeof newAsset.FacturaImagen)}
      <img 
        src={typeof newAsset.FacturaImagen === 'string' ? newAsset.FacturaImagen : bufferToDataUrl(newAsset.FacturaImagen,'image/png')} 
        alt="Factura Imagen" 
        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
      />
    </>
  ) : 'No Image'}
                </TableCell>
                <TableCell>{newAsset.OrdenCompraNum}</TableCell>
                <TableCell>
                {newAsset.OrdenCompraImagen ? (
    <>
      {console.log('Tipo de OrdenCompraImagen:', typeof newAsset.OrdenCompraImagen)}
      <img 
        src={typeof newAsset.OrdenCompraImagen === 'string' ? newAsset.OrdenCompraImagen : bufferToDataUrl(newAsset.OrdenCompraImagen,'image/png')} 
        alt="Orden Compra Imagen" 
        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
      />
    </>
  ) : 'No Image'}
                </TableCell>
                <TableCell>{newAsset.NumeroAsiento}</TableCell>
                <TableCell>{newAsset.NumeroBoleta}</TableCell>
                <TableCell>{newAsset.Usuario}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="info"
                    sx={{ margin: "5px" }}
                    onClick={() => handleEdit(newAsset)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ margin: "5px" }}
                    onClick={() => handleDelete(newAsset.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={() => setOpenAddDialog(true)}>Agregar</Button>
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Agregar Activo</DialogTitle>
        <DialogContent>
          {/* Aquí va el formulario de agregar un nuevo activo */}
          <RegisterAsset></RegisterAsset>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleAdd()}>Agregar</Button>
          <Button onClick={() => setOpenAddDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Activo</DialogTitle>
        <DialogContent>
          {/* Aquí va el formulario de editar un nuevo activo */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleUpdate()}>Actualizar</Button>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={newAssets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </div>
  );
}
