import {
  Grid,
  Button,
  TextField,
  Card,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import api from "../../app/api/api";
import { assetRetirementModel } from "../../app/models/assetRetirementModel";
import { SelectChangeEvent } from "@mui/material/Select";
import ReactToPrint from "react-to-print";

type Asset = {
  id: number;
  placa: string;
  descripcion: string;
  cuentaPrincipal: string;
  tipoActivo: string;
  zonas: string;
};

export default function AssetRetirementFrm() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [documentoAprobacion, setDocumentoAprobacion] = useState<File | null>(
    null
  );
  const [fotografia, setFotografia] = useState<File | null>(null);
  const [razonBaja, setRazonBaja] = useState<string>("");
  const [destinoFinal, setDestinoFinal] = useState<string>("");
  const [numeroBoleta, setNumeroBoleta] = useState<string>("");
  const [usuario, setUsuario] = useState<string>("user123"); // Simulando usuario automático

  // Referencia para el contenedor a imprimir
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cargar lista de activos al montar el componente
    async function fetchAssets() {
      try {
        const response = await api.newAsset.getNewAssets();
        setAssets(response.data);
      } catch (error) {
        toast.error("Error al cargar la lista de activos");
      }
    }

    fetchAssets();
    generarNumeroBoleta();
  }, []);

  const handleSelectChange = async (event: SelectChangeEvent<string>) => {
    const assetId = event.target.value;
    try {
      const response = await api.newAsset.getNewAssets();//`/activos/${assetId}`
      setSelectedAsset(response.data);
    } catch (error) {
      toast.error("Error al cargar la información del activo");
    }
  };

  const handleDocumentoAprobacionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setDocumentoAprobacion(event.target.files[0]);
    }
  };

  const handleFotografiaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setFotografia(event.target.files[0]);
    }
  };

  const generarNumeroBoleta = () => {
    // Generar consecutivo automático (B1, B2, etc.)
    const consecutivo = "B" + (Math.floor(Math.random() * 100) + 1);//hay que corregir esto
    setNumeroBoleta(consecutivo);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Validaciones y envío de datos
    const formData = new FormData();
    formData.append("PlacaActivo", selectedAsset?.id.toString() || "");
    formData.append("DocumentoAprobado", documentoAprobacion as Blob);
    formData.append("RazonBaja", razonBaja);
    formData.append("DestinoFinal", destinoFinal);
    formData.append("Fotografia", fotografia as Blob);
    formData.append("NumeroBoleta", numeroBoleta);
    formData.append("Usuario", usuario);

    try {
      await api.assetRetirement.saveAssetRetirement(formData);//qui se deberia de guardar en el historial, y llamar la api para eliminar el activo
      toast.success("Baja de activo registrada con éxito");
    } catch (error) {
      toast.error("Error al registrar la baja de activo");
    }
  };

  return (
    // Dentro del div que tiene el ref (componentRef)
    <div>
    <div ref={componentRef}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <h1>BAJA DE ACTIVOS</h1>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="Placa-Activo-label">Seleccionar Placa del Activo</InputLabel>
              <Select
                labelId="Placa-Activo-label"
                id="Placa-Activo"
                value={selectedAsset?.id.toString() || ""}
                onChange={handleSelectChange}
              >
                <MenuItem value="">
                  <em>Seleccione una opción</em>
                </MenuItem>
                {assets.map((asset) => (
                  <MenuItem key={asset.id} value={asset.id}>
                    {asset.placa}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            {selectedAsset && (
              <Card>
                <p><strong>Descripción:</strong> {selectedAsset.descripcion}</p>
                <p><strong>Cuenta Principal:</strong> {selectedAsset.cuentaPrincipal}</p>
                <p><strong>Tipo de Activo:</strong> {selectedAsset.tipoActivo}</p>
                <p><strong>Zonas:</strong> {selectedAsset.zonas}</p>
              </Card>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="razonBaja"
              name="razonBaja"
              label="Explicar Razón de Baja"
              value={razonBaja}
              onChange={(e) => setRazonBaja(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="destinoFinal"
              name="destinoFinal"
              label="Explicar Destino Final"
              value={destinoFinal}
              onChange={(e) => setDestinoFinal(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="documentoAprobacion">
              <Button variant="contained" component="span">
                Adjuntar Documento de Aprobación
              </Button>
            </label>
            <input
              id="documentoAprobacion"
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleDocumentoAprobacionChange}
            />
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="fotografia">
              <Button variant="contained" component="span">
                Adjuntar Fotografía
              </Button>
            </label>
            <input
              id="fotografia"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFotografiaChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="numeroBoleta"
              name="numeroBoleta"
              label="Número de Boleta"
              value={numeroBoleta}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="usuario"
              name="usuario"
              label="Usuario"
              value={usuario}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
      
      {/* Información adicional para impresión */}
      {selectedAsset && (
        <div style={{ marginTop: 20 }}>
          <h2>Detalles del Activo</h2>
          <p><strong>Placa:</strong> {selectedAsset.placa}</p>
          <p><strong>Descripción:</strong> {selectedAsset.descripcion}</p>
          <p><strong>Cuenta Principal:</strong> {selectedAsset.cuentaPrincipal}</p>
          <p><strong>Tipo de Activo:</strong> {selectedAsset.tipoActivo}</p>
          <p><strong>Zonas:</strong> {selectedAsset.zonas}</p>
          <p><strong>Razón de Baja:</strong> {razonBaja}</p>
          <p><strong>Destino Final:</strong> {destinoFinal}</p>
          <p><strong>Número de Boleta:</strong> {numeroBoleta}</p>
          <p><strong>Usuario:</strong> {usuario}</p>
          <p><strong>Hora:</strong>{Date.now()}</p>
          {documentoAprobacion && <p><strong>Documento de Aprobación:</strong> {documentoAprobacion.name}</p>}
          {fotografia && <p><strong>Fotografía Adjunta:</strong> {fotografia.name}</p>}
        </div>
      )}
    </div>
    <Grid container spacing={2} style={{ marginTop: 20 }}>
      <Grid item xs={12}>
        <ReactToPrint
          trigger={() => <Button variant="contained">Imprimir/Guardar como PDF</Button>}
          content={() => componentRef.current}
        />
      </Grid>
    </Grid>
  </div>
  )}

