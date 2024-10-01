import {Grid,Button,TextField,Card,Select,FormControl,FormHelperText,
  InputLabel,MenuItem,styled,
  Box,
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
import { equal } from "assert";

import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';


export default function RegisterAsset() {

  const { t } = useTranslation();
  const { changeLanguage, language } = useLanguage();
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
               toast.error(t('Activo-toast-errror'));
             }
           };
       
    fetchData();
  }, []);

  /**
 * Método para obtener el último consecutivo para una letra dada
 */
async function getLastConsecutive(letra: string): Promise<number> {
  try {
    const response = await api.newAsset.getAssetByNumBoleta(letra);
    if (response && response.data && Array.isArray(response.data)) {
      return response.data.length;
    } else {
      throw new Error("Invalid response from API");
    }
   } catch (error) {
    console.error("Error getting last consecutive:", error);
    return 0;
   }
  }
   /**
    * Meotodo para Generar consecutivo automático (C1, C2, etc.)
   */
   async function generarNumeroBoleta(letra: string): Promise<string> {
    const lastConsecutive = await getLastConsecutive(letra);
  const consecutivo = letra + (lastConsecutive + 1);
  newAsset.NumeroBoleta = consecutivo; 
  setNumeroBoleta(consecutivo);
  return consecutivo;
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

  /**
   * Metodo para guardar/registrar el activo obtenido del formulario
   * @param data 
   */
  const onSubmit = async (data: FieldValues) => {
    try {
      await api.newAsset.saveNewAsset(data);
      toast.success(t('Activo-toast-registro'));
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(t('Activo-toastError-registro'));
    }
  };

  /**
   * Metodo para actualizar Activo registrado
   * @param data 
   */
  const onSubmitEdit = async (data: FieldValues) => {
    try {
      const newAssetId = newAsset.id;
      await api.newAsset.updateNewAsset(newAssetId,data);
      toast.success("El Activo Se Actualizado Exitosamente");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Error al Actualizar El Activo");
    }
  };


  /**
   * Metodo para capturar los datos del formulario
   * @param data 
   */
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
      <Box p={2}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="codigo-cuenta-label">
                  {t('AgregarActivo-TituloCodigo')}
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
                    <MenuItem key={account.id} value={account.codigoCuenta}>
                      {account.codigoCuenta}
                    </MenuItem>
                  ))}
                </Select>
                {newAsset.CodigoCuenta > 0 && (
                  <FormHelperText>
                    <Card>
                      <p>
                        <strong>{t('CodigoCuenta-CuentaPrincipal')}:</strong> {accountingAccounts.find((account) => account.codigoCuenta === newAsset.CodigoCuenta)?.nombreCuentaPrincipal || ""}
                      </p>
                      <p>
                        <strong>{t('CodigoCuenta-Gastos')}:</strong>{" "}
                        {accountingAccounts.find((account) => account.codigoCuenta === newAsset.CodigoCuenta)?.gastos || ""}
                      </p>
                      <p>
                        <strong>{t('CodigoCuenta-Cuenta')}:</strong> {accountingAccounts.find((account) => account.codigoCuenta === newAsset.CodigoCuenta)?.nombreCuentaGastos || ""}
                      </p>
                      <p>
                        <strong>{t('CodigoCuenta-Depreciacion')}:</strong> {accountingAccounts.find((account) => account.codigoCuenta === newAsset.CodigoCuenta)?.depreciacion || ""}
                      </p>
                      <p>
                        <strong>{t('CodigoCuenta-DepreciacionCuenta')}:</strong> {accountingAccounts.find((account) => account.codigoCuenta === newAsset.CodigoCuenta)?.nombreCuentadDepreciacion || ""}
                      </p>
                    </Card>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="zona-label">{t('AgregarActivo-TituloZona')}</InputLabel>
                <Select
                  labelId="zona-label"
                  id="zona"
                  name="Zona"
                  value={newAsset.Zona.toString() || ""}
                  onChange={handleSelectChange}
                  label="Seleccionar Zona"
                >
                  {Array.isArray(zones) && zones.map((zone) => (
                    <MenuItem key={zone.id} value={zone.nombreZona}>
                      {zone.nombreZona}
                    </MenuItem>
                  ))}
                </Select>
                {newAsset.Zona.toString() && newAsset.Zona.toString() !== "0"  && (
                <FormHelperText>
                  <Card>
                  <p>
                    <strong>{t('Zona-Numero')}:</strong> {zones.find((zone) => zone.nombreZona === newAsset.Zona.toString())?.numeroZona || ""}
                  </p>
                  <p>
                    <strong>{t('Zona-Responsable')}:</strong> {zones.find((zone) => zone.nombreZona === newAsset.Zona.toString())?.responsableAreaNom_user || ""}
                  </p>
                  </Card>
                </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="tipo-label">{t('AgregarActivo-TituloTipo')}</InputLabel>
                <Select
                  labelId="tipo-label"
                  id="tipo"
                  name="Tipo"
                  value={newAsset.Tipo.toString() || ""}
                  onChange={handleSelectChange}
                  label="Seleccionar Tipo"
                >
                  {Array.isArray(serviceLives) && serviceLives.map((serviceLife) => (
                    <MenuItem key={serviceLife.id} value={serviceLife.tipo}>
                      {serviceLife.tipo}
                    </MenuItem>
                  ))}
                </Select>
                {newAsset.Tipo.toString() && newAsset.Tipo.toString() !== "0" && (
                  <FormHelperText>
                    <Card>
                      <p>
                        <strong>{t('Tipo-VidaUtil')}:</strong> {serviceLives.find((serviceLife) => serviceLife.tipo === newAsset.Tipo.toString())?.añoUtil || ""}
                      </p>
                    </Card>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="estado-label">{t('AgregarActivo-TituloEstado')}</InputLabel>
                  <Select
                    labelId="estado-label"
                    id="estado"
                    name="Estado"
                    value={newAsset.Estado.toString() || ""}
                    onChange={handleSelectChange}
                    label="Seleccionar Estado"
                  >
                    {Array.isArray(statuses) && statuses.map((status) => (
                      <MenuItem key={status.id} value={status.status}>
                        {status.status}
                          </MenuItem>
                    ))}
                  </Select>
                {/*<FormHelperText>Lista desplegable</FormHelperText>*/}
              </FormControl>
            </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="descripcion"
                  name="Descripcion"
                  label={t('AgregarActivo-TituloDescripcion')}
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
                  label={t('AgregarActivo-TituloPlaca')}
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
                  label={t('AgregarActivo-TituloCRC')}
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
                  label={t('AgregarActivo-TituloUSD')}
                  value={newAsset.ValorCompraUSD || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label" fullWidth>
                  {t('AgregarActivo-BotonFotografia')}
                  <VisuallyHiddenInput
                    type="file"
                    name="Fotografia"
                    onChange={handleFileInputChange}
                  />
                </Button>
                {newAsset.Fotografia && <FormHelperText>{t('EditarLista-TituloArchivo')}: {newAsset.Fotografia.name}</FormHelperText>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="nombre-proveedor"
                  name="NombreProveedor"
                  label={t('AgregarActivo-TituloProveedor')}
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
                  label={t('AgregarActivo-TituloFecha')}
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
                  label={t('AgregarActivo-TituloFactura')}
                  value={newAsset.FacturaNum || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" component="label" fullWidth>
                  {t('AgregarActivo-BotonFacturaDoc')}
                  <VisuallyHiddenInput
                    type="file"
                    name="FacturaImagen"
                    onChange={handleFileInputChange}
                  />
                </Button>
                {newAsset.FacturaImagen && <FormHelperText>{t('EditarLista-TituloArchivo')}: {newAsset.FacturaImagen.name}</FormHelperText>}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  id="orden-compra-num"
                  name="OrdenCompraNum"
                  label={t('AgregarActivo-TituloOrden')}
                  value={newAsset.OrdenCompraNum || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label" fullWidth>
                  {t('AgregarActivo-BotonOrdenDoc')}
                  <VisuallyHiddenInput
                    type="file"
                    name="OrdenCompraImagen"
                    onChange={handleFileInputChange}
                  />
                </Button>
                {newAsset.OrdenCompraImagen && <FormHelperText>{t('EditarLista-TituloArchivo')}: {newAsset.OrdenCompraImagen.name}</FormHelperText>}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  id="numero-asiento"
                  name="NumeroAsiento"
                  label={t('AgregarActivo-TituloAsiento')}
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
                  label={t('AgregarActivo-TituloBoleta')}
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
                  label={t('AgregarActivo-TituloUsuario')}
                  value={user?.nombre_usuario} //revisar ya que no lo guarda en  la base de datos
                  onChange={handleInputChange}
                />
              </Grid>
          </Grid>
            <Button  variant="contained" color="info" sx={{ margin: "5px" }} type="submit" disabled={isSubmitting}>
              {t('AgregarActivo-Boton')}
            </Button>
        </form>
      </Box>
    </Card>
  );
}