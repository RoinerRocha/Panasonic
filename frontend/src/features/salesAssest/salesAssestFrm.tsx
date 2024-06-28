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
  import { assetSaleModel } from "../../app/models/assetSaleModel";
  import { SelectChangeEvent } from "@mui/material/Select";
  import ReactToPrint from "react-to-print";
  import { useAppDispatch, useAppSelector } from "../../store/configureStore";
  
  export default function SalesAssetFrm() {
    const [assets, setAssets] = useState<assetSaleModel[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<assetSaleModel | null>(null);
    const [documentoAprobacion, setDocumentoAprobacion] = useState<File | null>(null);
    const [cotizacionVenta, setCotizacionVenta] = useState<File | null>(null);
    const [documentoAprobacionBanco, setDocumentoAprobacionBanco] = useState<File | null>(null);
    const [fotografia, setFotografia] = useState<File | null>(null);
    const [razonVenta, setRazonVenta] = useState<string>("");
    const [montoVenta, setMontoVenta] = useState<Number>(0);
    const [numeroBoleta, setNumeroBoleta] = useState<string>("");
    const { user } = useAppSelector((state) => state.account);
  
    // Referencia para el contenedor a imprimir
    const componentRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      // Cargar lista de activos al montar el componente
      async function fetchAssets() {
        try {
          const response = await api.newAsset.getNewAssets();
          setAssets(response.data);
          console.log("Activos cargados:", response.data);
        } catch (error) {
          toast.error("Error al cargar la lista de activos");
        }
      }
  
      fetchAssets();
      generarNumeroBoleta("S");
    }, []);
  
    const handleSelectChange = async (event: SelectChangeEvent<string>) => {
      const assetId = event.target.value;
      try {
        const assetResponse = await api.newAsset.getNewAssetById(parseInt(assetId));
        setSelectedAsset(assetResponse.data);
      } catch (error) {
        toast.error("Error al cargar la información del activo");
      }
    };
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setAssets((prevAsset) => ({
        ...prevAsset,
        [name]: value,
      }));
    };
  
    const handleDocumentoAprobacionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        setDocumentoAprobacion(event.target.files[0]);
      }
    };
  
    const handleCotizacionVentaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        setCotizacionVenta(event.target.files[0]);
      }
    };
  
    const handleDocumentoAprobacionBancoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        setDocumentoAprobacionBanco(event.target.files[0]);
      }
    };
  
    const handleFotografiaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        setFotografia(event.target.files[0]);
      }
    };
  
    /**
     * Método para Generar consecutivo automático (S1, S2, etc.)
     */
    var consecutivoBolet: string;
    async function generarNumeroBoleta(letra: string): Promise<void> {
      try {
        const response = await api.newAsset.getAssetByNumBoleta(letra);
        if (response && response.data && Array.isArray(response.data) && response.data.length >= 0) {
          const consecutivo = letra + (response.data.length + 1);
          consecutivoBolet = consecutivo;
          setNumeroBoleta(consecutivo);
        } else {
          console.error("Invalid response from API");
        }
      } catch (error) {
        console.error("Error generating boleta number:", error);
      }
    }
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Validaciones y envío de datos
      const formData = new FormData();
      const id = selectedAsset?.id.toString() || "";
      formData.append("PlacaActivo", selectedAsset?.id.toString() || "");
      formData.append("DocumentoAprobado", documentoAprobacion as Blob);
      formData.append("DocumentoAprobadoBanco", documentoAprobacionBanco as Blob);
      formData.append("CotizacionVenta", cotizacionVenta as Blob);
      formData.append("RazonVenta", razonVenta);
      formData.append("Fotografia", fotografia as Blob);
      formData.append("NumeroBoleta", consecutivoBolet);
      formData.append("Usuario", user?.nombre_usuario || "");
  
      try {
        await api.assetRetirement.saveAssetRetirement(formData);
        await api.newAsset.deleteNewAsset(parseInt(id));
        toast.success("Venta de activo registrada con éxito");
      } catch (error) {
        toast.error("Error al registrar la Venta del Activo");
      }
    };
  
    return (
      <div>
        <div ref={componentRef}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <h1>VENTA DE ACTIVOS</h1>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="Placa-Activo-label">Seleccionar Placa del Activo</InputLabel>
                  <Select
                    labelId="Placa-Activo-label"
                    id="Placa-Activo"
                    value={selectedAsset ? selectedAsset.id.toString() : ""}
                    onChange={handleSelectChange}
                  >
                    <MenuItem>
                      <em>Seleccione una opción</em>
                    </MenuItem>
                    {assets.map((asset) => (
                      <MenuItem key={asset.id} value={asset.id.toString()}>
                        {asset.PlacaActivo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                {selectedAsset && (
                  <Card>
                    <p><strong>Descripción:</strong> {selectedAsset.Descripcion}</p>
                    <p><strong>Cuenta Principal:</strong> {selectedAsset.CodigoCuenta}</p>
                    <p><strong>Tipo de Activo:</strong> {selectedAsset.Tipo}</p>
                    <p><strong>Zonas:</strong> {selectedAsset.Zona}</p>
                  </Card>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="razonVenta"
                  name="razonVenta"
                  label="Explicar Razón de Venta"
                  value={razonVenta}
                  onChange={(e) => setRazonVenta(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  id="valor-venta"
                  name="ValorVenta"
                  label="Monto de Venta"
                  value={montoVenta}
                  onChange={handleInputChange}
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
                  style={{ display: "none" }}
                  onChange={handleDocumentoAprobacionChange}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="cotizacionVenta">
                  <Button variant="contained" component="span">
                    Adjuntar Cotización de Venta
                  </Button>
                </label>
                <input
                  id="cotizacionVenta"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={handleCotizacionVentaChange}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="fotografia">
                  <Button variant="contained" component="span">
                    Adjuntar Fotografía Actual del Activo
                  </Button>
                </label>
                <input
                  id="fotografia"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFotografiaChange}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="comprobanteBanco">
                  <Button variant="contained" component="span">
                    Adjuntar Comprobante Banco
                  </Button>
                </label>
                <input
                  id="comprobanteBanco"
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  style={{ display: "none" }}
                  onChange={handleDocumentoAprobacionBancoChange}
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
                  value={user?.nombre_usuario || ""}
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
  
          {selectedAsset && (
            <div style={{ marginTop: 20 }}>
              <h2>Detalles Venta Activo</h2>
              <p><strong>Placa:</strong> {selectedAsset.PlacaActivo}</p>
              <p><strong>Descripción:</strong> {selectedAsset.Descripcion}</p>
              <p><strong>Cuenta Principal:</strong> {selectedAsset.CodigoCuenta}</p>
              <p><strong>Tipo de Activo:</strong> {selectedAsset.Tipo}</p>
              <p><strong>Zonas:</strong> {selectedAsset.Zona}</p>
              <p><strong>Razón de Venta:</strong> {razonVenta}</p>
              <p><strong>Monto de Venta:</strong> {montoVenta.toString()}</p>
              <p><strong>Número de Boleta:</strong> {numeroBoleta}</p>
              <p><strong>Usuario:</strong> {user?.nombre_usuario}</p>
              <p><strong>Fecha/Hora:</strong> {new Date().toLocaleString()}</p>
              {documentoAprobacion && (
                <p><strong>Documento de Aprobación:</strong> {documentoAprobacion.name}</p>
              )}
              {cotizacionVenta && (
                <p><strong>Cotización de Venta:</strong> {cotizacionVenta.name}</p>
              )}
              {documentoAprobacionBanco && (
                <p><strong>Comprobante Banco:</strong> {documentoAprobacionBanco.name}</p>
              )}
              {fotografia && (
                <p><strong>Fotografía Adjunta del Activo:</strong> {fotografia.name}</p>
              )}
            </div>
          )}
        </div>
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item xs={12}>
            <ReactToPrint
              trigger={() => (
                <Button variant="contained">Imprimir/Guardar como PDF</Button>
              )}
              content={() => componentRef.current}
            />
          </Grid>
        </Grid>
  
        <style>
          {`
            @media print {
              input[type="file"] {
                display: none;
              }
            }
          `}
        </style>
      </div>
    );
  }
  