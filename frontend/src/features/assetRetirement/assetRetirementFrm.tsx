import {Grid,Button,TextField,Card,Select,FormControl,FormHelperText,
  InputLabel,MenuItem,styled,
  Box,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../app/api/api";
import { newAssetModels } from "../../app/models/newAssetModels";
import { assetRetirementModel } from "../../app/models/assetRetirementModel";
import { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';

import { useAppDispatch, useAppSelector } from "../../store/configureStore";//ruta para obtener el usuario
import NewAsset from "../NewAsset/newAsset";
import assert from "assert";


export default function RegisterAsset() {

  const { t } = useTranslation();
  const { changeLanguage, language } = useLanguage();
  const navigate = useNavigate();
  const [numeroBoleta, setNumeroBoleta] = useState<string>("");

  // Estados para el nuevo activo y las listas desplegables
  const [newAssetRetirement, setNewAssetRetirement] = useState<assetRetirementModel>({
    id:0,
    PlacaActivo: "",
    DocumentoAprobado: null,
    Descripcion: "",
    DestinoFinal: "",
    Fotografia: null,
    NumeroBoleta: numeroBoleta, // Consecutivo automático
    Usuario: "" // Usuario automático
  });
  const [assets, setAssets] = useState<newAssetModels[]>([]);
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
    generarNumeroBoleta("B");

    const fetchData = async () => {
      try {
        const [ assetsData] = await Promise.all([
          api.newAsset.getNewAssets()
        ]);
        
               // Se verifica que las respuestas sean arrays antes de actualizar el estado
              if (assetsData && Array.isArray(assetsData.data)) {
                setAssets(assetsData.data);
              } else {
                console.error("Assets data is not an array", assetsData);
              }
       
             } catch (error) {
               console.error("Error fetching data:", error);
               toast.error(t('Baja-toast-error'));
             }
           };
       
    fetchData();
  }, []);

  /**
 * Método para obtener el último consecutivo para una letra dada
 */
async function getLastConsecutive(letra: string): Promise<number> {
  try {
    const response = await api.assetRetirement.getAssetRetirementByNumeroBoleta(letra);
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
    * Meotodo para Generar consecutivo automático (B1, B2, etc.)
   */
   async function generarNumeroBoleta(letra: string): Promise<string> {
    const lastConsecutive = await getLastConsecutive(letra);
    const consecutivo = letra + (lastConsecutive + 1);
  newAssetRetirement.NumeroBoleta = consecutivo; 
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
    setNewAssetRetirement((prevAsset) => ({
      ...prevAsset,
      [name]: value,
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewAssetRetirement((prevAsset) => ({
      ...prevAsset,
      [name]: value,
    }));
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    if (files && files.length > 0) {
      setNewAssetRetirement((prevAsset) => ({
        ...prevAsset,
        [name]: files[0],
      }));
    }
  };


  //esto tambien es nuevo
  const onSubmit = async (data: FieldValues) => {
    try {
      await api.assetRetirement.saveAssetRetirement(data);
      toast.success(t('Baja-toast-Guardar'));
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(t('Baja-toast-GuardarError'));
    }
  };


  // esto tambien es nuevo
  const handleFormSubmit = (data: FieldValues) => {
    // Ajustar datos antes de enviar al backend
    const formData = new FormData();
    formData.append("PlacaActivo", newAssetRetirement.PlacaActivo.toString());
    if (newAssetRetirement.DocumentoAprobado) {
      formData.append("DocumentoAprobado", newAssetRetirement.DocumentoAprobado);
    }
    formData.append("Descripcion", newAssetRetirement.Descripcion);
    formData.append("DestinoFinal", newAssetRetirement.DestinoFinal);
    if (newAssetRetirement.Fotografia) {
      formData.append("Fotografia", newAssetRetirement.Fotografia);
    }
    formData.append("NumeroBoleta", newAssetRetirement.NumeroBoleta);
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
                <InputLabel id="placa-activo-label">
                  {t('Baja-Placa')}
                </InputLabel>
                <Select
                  labelId="placa-activo-label"
                  id="placa-activo"
                  name="PlacaActivo"
                  value={newAssetRetirement.PlacaActivo.toString() || ""}
                  onChange={handleSelectChange}
                  label="Seleccionar Placa del Activo"
                
                >
                  {Array.isArray(assets) && assets.map((account) => (
                    <MenuItem key={account.id} value={account.NumeroPlaca}>
                      {account.NumeroPlaca}
                    </MenuItem>
                  ))}
                </Select>
                {newAssetRetirement.PlacaActivo > "0" && (
                  <FormHelperText>
                    <Card>
                      <p>
                        <strong>{t('Placa-Descripcion')}:</strong>  {assets.find((account) => account.NumeroPlaca.toString() === newAssetRetirement.PlacaActivo.toString())?.Descripcion || ""}
                      </p>
                      <p>
                        <strong>{t('Placa-CuentaPrincipal')}:</strong>{" "}
                        {assets.find((account) => account.NumeroPlaca.toString() === newAssetRetirement.PlacaActivo.toString())?.CodigoCuenta || ""}
                      </p>
                      <p>
                        <strong>{t('Placa-Tipo')}:</strong> {assets.find((account) => account.NumeroPlaca.toString() === newAssetRetirement.PlacaActivo.toString())?.Tipo || ""}
                      </p>
                      <p>
                        <strong>{t('Placa-Zona')}:</strong>{assets.find((account) => account.NumeroPlaca.toString() === newAssetRetirement.PlacaActivo.toString())?.Zona || ""}
                      </p>
                      <p>
                        <strong>{t('Placa-Estado')}:</strong>{assets.find((account) => account.NumeroPlaca.toString() === newAssetRetirement.PlacaActivo.toString())?.Estado || ""}
                      </p>
                      <p>
                        <strong>{t('Placa-Boleta')}:</strong>{assets.find((account) => account.NumeroPlaca.toString() === newAssetRetirement.PlacaActivo.toString())?.NumeroBoleta || ""}
                      </p>
                      
                    </Card>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="descripcion"
                  name="Descripcion"
                  label={t('Baja-Razon')}
                  value={newAssetRetirement.Descripcion || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="destinoFinal"
                  name="DestinoFinal"
                  label={t('Baja-Destino')}
                  value={newAssetRetirement.DestinoFinal || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label" fullWidth>
                  {t('Baja-BotonFotografia')}
                  <VisuallyHiddenInput
                    type="file"
                    name="Fotografia"
                    onChange={handleFileInputChange}
                  />
                </Button>
                {newAssetRetirement.Fotografia && <FormHelperText>Archivo cargado: {newAssetRetirement.Fotografia.name}</FormHelperText>}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  disabled
                  id="numero-boleta"
                  name="NumeroBoleta"
                  label={t('Baja-Boleta')}
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
                  label={t('Baja-Usuario')}
                  value={user?.nombre_usuario} //revisar ya que no lo guarda en  la base de datos
                  onChange={handleInputChange}
                />
              </Grid>
          </Grid>
            <Button type="submit" disabled={isSubmitting}>
              {t('Baja-BotonAgregar')}
            </Button>
        </form>
      </Box>
    </Card>
  );
}