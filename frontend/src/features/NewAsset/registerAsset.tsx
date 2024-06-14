import {
    Grid,
    Button,
    TextField,
    Card,
    Select,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
  } from "@mui/material";
  import { useState, useEffect } from "react";
  import { toast } from "react-toastify";
  import api from "../../app/api/api";
  import { newAssetModels } from "../../app/models/newAssetModels";
  import { Zona } from "../../app/models/zone"; // Zonas
  import { accountingAccount } from "../../app/models/accountingAccount"; // Cuentas
  import { serviceLifeModels } from "../../app/models/serviceLifeModels"; // Tipos
  import { statusAssets } from "../../app/models/statusAsset"; // Estados
  import { SelectChangeEvent } from '@mui/material/Select';
  
  
  interface Props {
    newAssets: newAssetModels[];
    setNewAssets: React.Dispatch<React.SetStateAction<newAssetModels[]>>;
    zonas: Zona[];
    setZonas: React.Dispatch<React.SetStateAction<Zona[]>>;
    accountingAccounts: accountingAccount[];
    setAccountingAccounts: React.Dispatch<React.SetStateAction<accountingAccount[]>>;
    serviceLifes: serviceLifeModels[];
    setServiceLifes: React.Dispatch<React.SetStateAction<serviceLifeModels[]>>;
    statusAssets: statusAssets[];
    setStatusAssets: React.Dispatch<React.SetStateAction<statusAssets[]>>;
  }
  

  export default function RegisterAsset({
    newAssets,
    setNewAssets,
    zonas,
    setZonas,
    accountingAccounts,
    setAccountingAccounts,
    serviceLifes,
    setServiceLifes,
    statusAssets,
    setStatusAssets,
  }: Props) {
    const [selectedNewAsset, setSelectedNewAsset] =
      useState<newAssetModels | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newAsset, setNewAsset] = useState<Partial<newAssetModels>>({
      Zona: 0,
      Tipo: 0,
      Estado: 0,
      Descripcion: "",
      NumeroPlaca: 0,
      ValorCompra: "",
      Fotografia: null,
      NombreProveedor: "",
      FechaCompra: new Date(), // Convert to ISO string
      FacturaNum: 0,
      FacturaImagen: null,
      OrdenCompraNum: 0,
      OrdenCompraImagen: null,
      NumeroAsiento: 0,
      NumeroBoleta: "",
      Usuario: "",
    });
  
    // Cargar datos en las listas desplegables al montar el componente
    useEffect(() => {
      const fetchZonas = async () => {
        try {
            const listZones = await api.Zones.getZona();
            if (listZones) {
              setZonas(listZones); // Solo actualizar si listZones es válido
            } else {
              console.error("No se recibieron zonas válidas");
            }
          } catch (error) {
            console.error("Error al cargar las zonas:", error);
          }
      };
  
      const fetchCuentas = async () => {
        try {
          const listCuentas = await api.AcountingAccounts.getAccountingAccounts();
          setAccountingAccounts(listCuentas);
        } catch (error) {
          console.error("Error al cargar las cuentas contables:", error);
        }
      };
  
      const fetchTipos = async () => {
        try {
          const listTipos = await api.serviceLife.getServiceLifes();
          setServiceLifes(listTipos);
        } catch (error) {
          console.error("Error al cargar los tipos de vida útil:", error);
        }
      };
  
      const fetchEstados = async () => {
        try {
          const listEstados = await api.statusAssets.getStatusAssets();
          setStatusAssets(listEstados);
        } catch (error) {
          console.error("Error al cargar los estados:", error);
        }
      };
  
      fetchZonas();
      fetchCuentas();
      fetchTipos();
      fetchEstados();
    }, [setZonas, setAccountingAccounts, setServiceLifes, setStatusAssets]);
  
    const handleEdit = (newAsset: newAssetModels) => {
      setSelectedNewAsset(newAsset);
      setOpenEditDialog(true);
    };
  
    const handleAdd = async () => {
      try {
        const addedStatusAsset = await api.newAsset.saveNewAsset(newAsset);
        toast.success("Activo agregado");
        setOpenAddDialog(false);
        setNewAssets((prevAssets) => [...prevAssets, addedStatusAsset]);
      } catch (error) {
        console.error("Error al agregar el nuevo activo:", error);
        toast.error("Error al agregar el nuevo activo");
      }
    };
  
    const handleInputChange: React.ChangeEventHandler<
      HTMLInputElement | HTMLTextAreaElement
    > = (event) => {
      const { name, value } = event.target;
      setNewAsset((prevAsset) => ({
        ...prevAsset,
        [name]: value,
      }));
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
  
    const handleSelectChange = (event: SelectChangeEvent<number>) => {
        const name = event.target.name as keyof typeof newAsset;
        const value = event.target.value as number; 
        setNewAsset((prevAsset) => ({
          ...prevAsset,
          [name]: value,
        }));
      };
  
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
      setNewAsset((prevAsset) => ({
        ...prevAsset,
        [name]: checked,
      }));
    };
  
    /*const handleAddDialogClose = () => {
      setOpenAddDialog(false);
      // Reset newAsset state to initial values
      setNewAsset({
        Zona: "",
        Tipo: "",
        Estado: "",
        Descripcion: "",
        NumeroPlaca: 0,
        ValorCompra: "",
        Fotografia: null,
        NombreProveedor: "",
        FechaCompra: new Date(), // Convert to ISO string
        FacturaNum: 0,
        FacturaImagen: null,
        OrdenCompraNum: 0,
        OrdenCompraImagen: null,
        NumeroAsiento: 0,
        NumeroBoleta: "",
        Usuario: "",
      });
    };
  */
    return (
      <Card>
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="codigo-cuenta-label">
                  Seleccionar Código de Cuenta
                </InputLabel>
                <Select
                  labelId="codigo-cuenta-label"
                  id="codigo-cuenta"
                  name="CodigoCuenta"
                  value={newAsset.NumeroAsiento || ""} // Corregir nombre de la propiedad según tu modelo //revisar ya qe en la tabla no se encuentra el codigoCuenta =newAsset.CodigoCuneta
                  onChange={handleSelectChange}
                  label="Seleccionar Código de Cuenta"
                >
                  {accountingAccounts.map((cuenta) => (
                    <MenuItem key={cuenta.id} value={cuenta.id}>
                      {cuenta.codigoCuenta}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Lista desplegable y mostrar detalle</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="zona-label">Seleccionar Zona</InputLabel>
                <Select
                  labelId="zona-label"
                  id="zona"
                  name="Zona"
                  value= {newAsset.Zona ?? 0}
                  onChange={handleSelectChange}
                  label="Seleccionar Zona"
                >
                  {zonas.map((zona) => (
                    <MenuItem key={zona.id} value={zona.id}>
                      {zona.nombreZona}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Lista desplegable y mostrar detalle</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="tipo-label">Seleccionar Tipo</InputLabel>
                <Select
                  labelId="tipo-label"
                  id="tipo"
                  name="Tipo"
                  value={newAsset.Tipo || ""}
                  onChange={handleSelectChange}
                  label="Seleccionar Tipo"
                >
                  {serviceLifes.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.tipo}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Lista desplegable y mostrar vida útil</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="estado-label">Seleccionar Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  id="estado"
                  name="Estado"
                  value={newAsset.Estado || ""}
                  onChange={handleSelectChange}
                  label="Seleccionar Estado"
                >
                  {statusAssets.map((estado) => (
                    <MenuItem key={estado.id} value={estado.id}>
                      {estado.status}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Lista desplegable</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="descripcion"
                name="Descripcion"
                label="Anotar Descripción"
                value={newAsset.Descripcion || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                id="numero-placa"
                name="NumeroPlaca"
                label="Numero de Placa"
                value={newAsset.NumeroPlaca || 0}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                id="valor-compra"
                name="ValorCompra"
                label="Valor de Compra CRC"
                value={newAsset.ValorCompra || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                id="fotografia"
                name="Fotografia"
                type="file"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="fotografia">
                <Button variant="contained" component="span">
                  Adjuntar Fotografía
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="nombre-proveedor"
                name="NombreProveedor"
                label="Nombre de Proveedor"
                value={newAsset.NombreProveedor || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                id="fecha-compra"
                name="FechaCompra"
                label="Fecha de Compra"
                value={newAsset.FechaCompra || new Date().toISOString().split('T')[0]}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                id="factura-num"
                name="FacturaNum"
                label="Factura"
                value={newAsset.FacturaNum || 0}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="application/pdf"
                id="factura-imagen"
                name="FacturaImagen"
                type="file"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="factura-imagen">
                <Button variant="contained" component="span">
                  Adjuntar Factura
                </Button>
              </label>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                id="orden-compra-num"
                name="OrdenCompraNum"
                label="Orden de Compra"
                value={newAsset.OrdenCompraNum || 0}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="application/pdf"
                id="orden-compra-imagen"
                name="OrdenCompraImagen"
                type="file"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="orden-compra-imagen">
                <Button variant="contained" component="span">
                  Adjuntar Orden de Compra
                </Button>
              </label>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                id="numero-asiento"
                name="NumeroAsiento"
                label="Numero de Asiento"
                value={newAsset.NumeroAsiento || 0}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                id="numero-boleta"
                name="NumeroBoleta"
                label="Numero de Boleta"
                value={`C${newAssets.length + 1}`} // Consecutivo automático
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                id="usuario"
                name="Usuario"
                label="Usuario"
                value={`David Bustillo`} // usuario automático
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </form>
        <Button onClick={handleAdd}>Agregar</Button>
      </Card>
    );
  }
