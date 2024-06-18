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
  styled,
} from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../app/api/api";
import { assetRetirementModel } from "../../app/models/assetRetirementModel";
//import { useNavigate } from "react-router-dom";
import { SelectChangeEvent } from "@mui/material/Select";
//import { useForm } from "react-hook-form";

export default function assetRetirementFrm() {
 // const navigate = useNavigate();

 /* const [assetRetirement, setassetRetirement] = useState<assetRetirementModel>({
    id: 0,
    PlacaActivo: "",
    DocumentoAprobado: null,
    Descripcion: "",
    DestinoFinal: "",
    Fotografia: null,
    NumeroBoleta: "", //M# Consecutivo automático
    Usuario: "", // user automatico
  });*/
  /* const {
        register,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors, isValid, isSubmitSuccessful },
      } = useForm({
        mode: "onTouched",
      });*/
  //falta terminarlo
  return (
    <Grid container spacing={2}>
      <h1>BAJA DE ACTIVOS</h1>
      <InputLabel id="Placa-Activo-label">
                Seleccionar Placa del Activo
      </InputLabel>
      <Select>
        <option value="0">Seleccione una opción</option>

      </Select>
      <TextField
              fullWidth
              id="razonBaja"
              name="expliRazon"
              label="Explicar Razón de Baja"
              //value={newAsset.Descripcion || ""}
              //onChange={handleInputChange}
            />
             <TextField
              fullWidth
              id="descripcion"
              name="Descripcion"
              label="Explicar destino Final"
              //value={newAsset.Descripcion || ""}
              //onChange={handleInputChange}
            />

            
            <label htmlFor="fotografia">
              <Button variant="contained" component="span">
                Adjuntar Fotografía
              </Button>
            </label>

    </Grid>
  );
}
