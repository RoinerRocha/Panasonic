import {Grid,Button,TextField,Card,Select,FormControl,FormHelperText,
  InputLabel,MenuItem,styled,
} from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../app/api/api";
import { newAssetModels } from "../../app/models/newAssetModels";
import { Zona } from "../../app/models/zone"; // Zonas
import { accountingAccount } from "../../app/models/accountingAccount"; // Cuentas
import { serviceLifeModels } from "../../app/models/serviceLifeModels"; // Tipos
import { statusAssets } from "../../app/models/statusAsset"; // Estados
import { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import AssetRetirementFrm from "../assetRetirement/assetRetirementFrm";

import { useAppDispatch, useAppSelector } from "../../store/configureStore";//ruta para obtener el usuario


export default function RegisterAsset() {

  const navigate = useNavigate();
  const [numeroBoleta, setNumeroBoleta] = useState<string>("");

  // Estados para el nuevo activo y las listas desplegables
  const [newAsset, setNewAsset] = useState<newAssetModels>({
    id:0,
    CodigoCuenta:0,
    Zona: 0,
    Tipo: 0,
    Estado: 0,
    Descripcion: "",
    NumeroPlaca: 0,
    ValorCompraCRC: "",
    ValorCompraUSD:"",
    Fotografia: null,
    NombreProveedor: "",
    FechaCompra: new Date(),
    FacturaNum: 0,
    FacturaImagen: null,
    OrdenCompraNum: 0,
    OrdenCompraImagen: null,
    NumeroAsiento: 0,
    NumeroBoleta: numeroBoleta, // Consecutivo automático
    Usuario: "" // Usuario automático
  });

  const [zones, setZones] = useState<Zona[]>([]);
  const [accountingAccounts, setAccountingAccounts] = useState<accountingAccount[]>([]);
  const [serviceLives, setServiceLives] = useState<serviceLifeModels[]>([]);
  const [statuses, setStatuses] = useState<statusAssets[]>([]);
  const dispatch = useAppDispatch(); 
  const {user} = useAppSelector(state => state.account);// se obtiene al usuario que esta logueado

  
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { isDirty, isSubmitting, errors, isValid, isSubmitSuccessful },
  } = useForm({
    mode: "onTouched",
  });

  useEffect(() => {
    // Fetch the data for the dropdowns
    generarNumeroBoleta("C");

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

   /**
    * Meotodo para Generar consecutivo automático (C1, C2, etc.)
   */
   async function generarNumeroBoleta(letra: string): Promise<void> {
    try {
      const response = await api.newAsset.getAssetByNumBoleta(letra);
      if (response && response.data && Array.isArray(response.data) && response.data.length >= 0) {
        const consecutivo = letra + (response.data.length + 1);
        setNumeroBoleta(consecutivo);
      } else {
        console.error("Invalid response from API");

      }
    } catch (error) {
      console.error("Error generating boleta number:", error);

    }
  }

  const handleApiErrors = (errors: any) => {
    if (Array.isArray(errors)) {
      errors.forEach((error: string) => {
        if (error.includes("numeroZona")) {
          setError("numeroZona", { message: error });
        } else if (error.includes("nombreZona")) {
          setError("nombreZona", { message: error });
        }
      });
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const name = event.target.name as keyof newAssetModels;
    const value = event.target.value;
    setNewAsset((prevAsset) => ({
      ...prevAsset,
      [name]: value,
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  // const handleAdd = async () => {
  //   try {
  //     const addedAsset = await api.newAsset.saveNewAsset(newAsset);
  //     toast.success("Activo agregado");
  //     navigate("/RegisterAsset"); // Redirigir a la lista de zonas después de agregar el activo
  //     //register(addedAsset);
  //   } catch (error) {
  //     handleApiErrors(errors);
  //     console.error("Error al agregar el nuevo activo:", error);
  //     toast.error("Error al agregar el nuevo activo");
  //   }
  // };

  //esto tambien es nuevo
  const onSubmit = async (data: FieldValues) => {
    try {
      await api.newAsset.saveNewAsset(data);
      toast.success("Activo registrado exitosamente");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Error registrando el activo");
    }
  };


  // esto tambien es nuevo
  const handleFormSubmit = (data: FieldValues) => {
    // Ajustar datos antes de enviar al backend
    const formData = new FormData();
    formData.append("CodigoCuenta", newAsset.CodigoCuenta.toString());
    formData.append("Zona", newAsset.Zona.toString());
    formData.append("Tipo", newAsset.Tipo.toString());
    formData.append("Estado", newAsset.Estado.toString());
    formData.append("Descripcion", newAsset.Descripcion);
    formData.append("NumeroPlaca", newAsset.NumeroPlaca.toString());
    formData.append("ValorCompraCRC", newAsset.ValorCompraCRC);
    formData.append("ValorCompraUSD", newAsset.ValorCompraUSD);
    if (newAsset.Fotografia) {
      formData.append("Fotografia", newAsset.Fotografia);
    }
    formData.append("NombreProveedor", newAsset.NombreProveedor);
    formData.append("FechaCompra", newAsset.FechaCompra.toString());
    formData.append("FacturaNum", newAsset.FacturaNum.toString());
    if (newAsset.FacturaImagen) {
      formData.append("FacturaImagen", newAsset.FacturaImagen);
    }
    formData.append("OrdenCompraNum", newAsset.OrdenCompraNum.toString());
    if (newAsset.OrdenCompraImagen) {
      formData.append("OrdenCompraImagen", newAsset.OrdenCompraImagen);
    }
    formData.append("NumeroAsiento", newAsset.NumeroAsiento.toString());
    formData.append("NumeroBoleta", newAsset.NumeroBoleta);
    formData.append("Usuario", user?.nombre_usuario || ""); 

    onSubmit(formData);
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

  return (
    <Card>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                value={newAsset.CodigoCuenta.toString() || ""}
                onChange={handleSelectChange}
                label="Seleccionar Código de Cuenta"
              
              >
                {Array.isArray(accountingAccounts) && accountingAccounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.codigoCuenta}
                  </MenuItem>
                ))}
              </Select>
              {newAsset.CodigoCuenta > 0 && (
                <FormHelperText>
                  <Card>
                    <p>
                      <strong>NomCuentaPrincipal:</strong> {accountingAccounts.find((account) => account.id === newAsset.CodigoCuenta)?.nombreCuentaPrincipal || ""}
                    </p>
                    <p>
                      <strong>Gastos(D):</strong>{" "}
                      {accountingAccounts.find((account) => account.id === newAsset.CodigoCuenta)?.gastos || ""}
                    </p>
                    <p>
                      <strong>NomCuenta:</strong> {accountingAccounts.find((account) => account.id === newAsset.CodigoCuenta)?.nombreCuentaGastos || ""}
                    </p>
                    <p>
                      <strong>Depreciación(H):</strong> {accountingAccounts.find((account) => account.id === newAsset.CodigoCuenta)?.depreciacion || ""}
                    </p>
                    <p>
                      <strong>NomCuenta:</strong> {accountingAccounts.find((account) => account.id === newAsset.CodigoCuenta)?.nombreCuentadDepreciacion || ""}
                    </p>
                  </Card>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="zona-label">Seleccionar Zona</InputLabel>
              <Select
                labelId="zona-label"
                id="zona"
                name="Zona"
                value={newAsset.Zona.toString() || ""}
                onChange={handleSelectChange}
                label="Seleccionar Zona"
              >
                {Array.isArray(zones) && zones.map((zone) => (
                  <MenuItem key={zone.id} value={zone.id}>
                    {zone.nombreZona}
                  </MenuItem>
                ))}
              </Select>
              {newAsset.Zona > 0 && (
                <FormHelperText>
                  <Card>
                    <p>
                      <strong>Numero Zona:</strong> {zones.find((zone) => zone.id === newAsset.Zona)?.numeroZona || ""}
                    </p>
                    <p>
                      <strong>Responsable:</strong>{" "}
                      {zones.find((zone) => zone.id === newAsset.Zona)?.responsableAreaNom_user || ""}
                    </p>
                  </Card>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="tipo-label">Seleccionar Tipo</InputLabel>
              <Select
                labelId="tipo-label"
                id="tipo"
                name="Tipo"
                value={newAsset.Tipo.toString() || ""}
                onChange={handleSelectChange}
                label="Seleccionar Tipo"
              >
                {Array.isArray(serviceLives) && serviceLives.map((serviceLife) => (
                  <MenuItem key={serviceLife.id} value={serviceLife.id}>
                    {serviceLife.tipo}
                  </MenuItem>
                ))}
              </Select>
              {newAsset.Tipo > 0 && (
                <FormHelperText>
                  <Card>
                    <p>
                      <strong>Vida Util(Años):</strong> {serviceLives.find((serviceLife) => serviceLife.id === newAsset.Tipo)?.añoUtil || ""}
                    </p>
                  </Card>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="estado-label">Seleccionar Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  id="estado"
                  name="Estado"
                  value={newAsset.Estado.toString() || ""}
                  onChange={handleSelectChange}
                  label="Seleccionar Estado"
                >
                  {Array.isArray(statuses) && statuses.map((status) => (
                    <MenuItem key={status.id} value={status.id.toString()}>
                      {status.status}
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
                type="text"
                id="numero-placa"
                name="NumeroPlaca"
                label="Numero de Placa"
                value={newAsset.NumeroPlaca || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                id="valor-compra"
                name="ValorCompraCRC"
                label="Valor de Compra (CRC)"
                value={newAsset.ValorCompraCRC || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                id="valor-compra"
                name="ValorCompraUSD"
                label="Valor de Compra (USD)"
                value={newAsset.ValorCompraUSD || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label" fullWidth>
                Subir Imagen de Fotografia
                <VisuallyHiddenInput
                  type="file"
                  name="Fotografia"
                  onChange={handleFileInputChange}
                />
              </Button>
              {newAsset.Fotografia && <FormHelperText>Archivo cargado: {newAsset.Fotografia.name}</FormHelperText>}
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
                value={newAsset.FechaCompra}
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
                value={newAsset.FacturaNum || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" component="label" fullWidth>
                Subir Imagen de Factura
                <VisuallyHiddenInput
                  type="file"
                  name="FacturaImagen"
                  onChange={handleFileInputChange}
                />
              </Button>
              {newAsset.FacturaImagen && <FormHelperText>Archivo cargado: {newAsset.FacturaImagen.name}</FormHelperText>}
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                id="orden-compra-num"
                name="OrdenCompraNum"
                label="Orden de Compra"
                value={newAsset.OrdenCompraNum || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label" fullWidth>
                Subir Imagen de Factura
                <VisuallyHiddenInput
                  type="file"
                  name="OrdenCompraImagen"
                  onChange={handleFileInputChange}
                />
              </Button>
              {newAsset.OrdenCompraImagen && <FormHelperText>Archivo cargado: {newAsset.OrdenCompraImagen.name}</FormHelperText>}
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                id="numero-asiento"
                name="NumeroAsiento"
                label="Numero de Asiento"
                value={newAsset.NumeroAsiento || ""}
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
                value={numeroBoleta} //revisar ya que no lo guarda en la base de datos
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                id="usuario"
                name="Usuario"
                label={user?.nombre_usuario}
                value={user?.nombre_usuario} //revisar ya que no lo guarda en  la base de datos
                onChange={handleInputChange}
              />
            </Grid>
        </Grid>
          <Button type="submit" disabled={isSubmitting}>
            Agregar
          </Button>
      </form>
    </Card>
  );
}