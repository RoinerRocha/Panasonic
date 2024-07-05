import {
  TableContainer, Paper, Table, TableCell, TableHead,
  TableRow, TableBody, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, TablePagination,
  FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import { newAssetModels } from "../../app/models/newAssetModels";
import { useState, useEffect } from "react";
import api from "../../app/api/api";
import { toast } from "react-toastify";
import RegisterAsset from "./registerAsset";
import { SelectChangeEvent } from "@mui/material/Select";
import { accountingAccount } from "../../app/models/accountingAccount";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";//ruta para obtener el usuario

interface Props {
  newAssets: newAssetModels[];
  setNewAssets: React.Dispatch<React.SetStateAction<newAssetModels[]>>;
}

function NewAssetsList({ newAssets, setNewAssets }: Props) {
  const [accountingAccounts, setAccountingAccounts] = useState<accountingAccount[]>([]);
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
  const {user} = useAppSelector(state => state.account);// se obtiene al usuario que esta logueado

  useEffect(() => {
    loadNewAsset()
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
        //console.log("URL img Activo: "+asset.Fotografia);
        setImageUrlMap((prevMap) => {
          const assetMap = prevMap.get(asset.id) || new Map();
          const imageUrl = `http://localhost:5000/${asset.Fotografia}`;
          //console.log(`Fotografía URL para ID ${asset.id}: ${imageUrl}`);
          //console.log(prevMap);
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
  

  /**
   * Metodo para eliminar el activo por id
   * @param id del activo seleccionado
   */
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

  const handleUpdateAsset = async (updatedAsset: newAssetModels) => {
    if (selectedNewAsset) {
      try {
        const newAssetId = selectedNewAsset.id;
        const formData = new FormData();
        formData.append("CodigoCuenta", selectedNewAsset.CodigoCuenta.toString());
        formData.append("Zona", selectedNewAsset.Zona.toString());
    formData.append("Tipo", selectedNewAsset.Tipo.toString());
    formData.append("Estado", selectedNewAsset.Estado.toString());
    formData.append("Descripcion", selectedNewAsset.Descripcion);
    formData.append("NumeroPlaca", selectedNewAsset.NumeroPlaca.toString());
    formData.append("ValorCompraCRC", selectedNewAsset.ValorCompraCRC);
    formData.append("ValorCompraUSD", selectedNewAsset.ValorCompraUSD);
    if (newAsset.Fotografia) {
      formData.append("Fotografia", newAsset.Fotografia);
    }
    formData.append("NombreProveedor", selectedNewAsset.NombreProveedor);
    formData.append("FechaCompra", selectedNewAsset.FechaCompra.toString());
    formData.append("FacturaNum", selectedNewAsset.FacturaNum.toString());
    if (newAsset.FacturaImagen) {
      formData.append("FacturaImagen", newAsset.FacturaImagen);
    }
    formData.append("OrdenCompraNum", selectedNewAsset.OrdenCompraNum.toString());
    if (newAsset.OrdenCompraImagen) {
      formData.append("OrdenCompraImagen", newAsset.OrdenCompraImagen);
    }
    formData.append("NumeroAsiento", selectedNewAsset.NumeroAsiento.toString());
    formData.append("NumeroBoleta", selectedNewAsset.NumeroBoleta);
    formData.append("Usuario", user?.nombre_usuario || ""); 
        
        await api.newAsset.updateNewAsset(newAssetId, formData);
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

  // Función para manejar la apertura del diálogo de detalles del Activo seleccionado
  const handleRowClick = (newAsset: newAssetModels) => {
    setSelectedNewAsset(newAsset);
    setOpenDetailDialog(true);
  };

  return (
    <div>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProfiles.map((newAsset) => (
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
                    <img 
                      src={imageUrlMap.get(newAsset.id)?.get('FacturaImagen') || ''} 
                      alt="Factura Imagen" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ) : 'No Image'}
                </TableCell>
                <TableCell>{newAsset.OrdenCompraNum}</TableCell>
                <TableCell>
                  {newAsset.OrdenCompraImagen ? (
                    <img 
                      src={imageUrlMap.get(newAsset.id)?.get('OrdenCompraImagen') || ''} 
                      alt="Orden Compra Imagen" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
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
         {/* <Button onClick={() => handleAdd()}>Agregar</Button>*/}
          <Button onClick={() => setOpenAddDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Activo</DialogTitle>
        <DialogContent>
          {/* Aquí va el formulario de editar un nuevo activo */}
        </DialogContent>
        <DialogActions>
          <Button>Actualizar</Button>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)}>
        <DialogTitle>Detalle del Activo</DialogTitle>
        <DialogContent>
          {selectedNewAsset && (
            <div>
              <p><strong>Código Cuenta:</strong> {selectedNewAsset.CodigoCuenta}</p>
              <p><strong>Zona:</strong> {selectedNewAsset.Zona}</p>
              <p><strong>Tipo:</strong> {selectedNewAsset.Tipo}</p>
              <p><strong>Estado:</strong> {selectedNewAsset.Estado}</p>
              <p><strong>Descripción:</strong> {selectedNewAsset.Descripcion}</p>
              <p><strong>Número Placa:</strong> {selectedNewAsset.NumeroPlaca}</p>
              <p><strong>Valor Compra CRC:</strong> {'₡' + selectedNewAsset.ValorCompraCRC}</p>
              <p><strong>Valor Compra USD:</strong> {'$' + selectedNewAsset.ValorCompraUSD}</p>
              <p><strong>Fotografía:</strong></p>
              {imageUrlMap.get(selectedNewAsset.id)?.get('Fotografia') ? (
                <img
                  src={imageUrlMap.get(selectedNewAsset.id)?.get('Fotografia')}
                  alt="Fotografía"
                  style={{ width: '700px', height: '700px', objectFit: 'cover' }}
                />
              ) : 'No Image'}
              <p><strong>Nombre Proveedor:</strong> {selectedNewAsset.NombreProveedor}</p>
              <p><strong>Fecha Compra:</strong> {new Date(selectedNewAsset.FechaCompra).toLocaleDateString()}</p>
              <p><strong>Número Factura:</strong> {selectedNewAsset.FacturaNum}</p>
              <p><strong>Factura Imagen:</strong></p>
              {imageUrlMap.get(selectedNewAsset.id)?.get('FacturaImagen') ? (
                <img
                  src={imageUrlMap.get(selectedNewAsset.id)?.get('FacturaImagen')}
                  alt="Factura Imagen"
                  style={{ width: '700px', height: '700px', objectFit: 'cover' }}
                />
              ) : 'No Image'}
              <p><strong>Orden Compra Número:</strong> {selectedNewAsset.OrdenCompraNum}</p>
              <p><strong>Orden Compra Imagen:</strong></p>
              {imageUrlMap.get(selectedNewAsset.id)?.get('OrdenCompraImagen') ? (
                <img
                  src={imageUrlMap.get(selectedNewAsset.id)?.get('OrdenCompraImagen')}
                  alt="Orden Compra Imagen"
                  style={{ width: '700px', height: '700px', objectFit: 'cover' }}
                />
              ) : 'No Image'}
              <p><strong>Número Asiento:</strong> {selectedNewAsset.NumeroAsiento}</p>
              <p><strong>Número Boleta:</strong> {selectedNewAsset.NumeroBoleta}</p>
              <p><strong>Usuario:</strong> {selectedNewAsset.Usuario}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      <TablePagination
        rowsPerPageOptions={[10, 15, 25]}
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

export default NewAssetsList;