import { useEffect, useState } from "react"
import api from "../../app/api/api"
import { Zona } from "../../app/models/zone"
import MapList from "../Maps/MapList"
import { Grid } from "@mui/material";

export default function Map() {
    const [zonas, setZonas] = useState<Zona[]>([]);
    useEffect(() => {
        api.Zones.getZona()
        .then(response => {
            // Verificamos si la respuesta es un objeto con la propiedad 'data' que es un array
            if (response && Array.isArray(response.data)) {
                // Asignamos el array de zonas a setZonas
                setZonas(response.data);
            } else {
                console.error("La respuesta de la API no es un array de Zona:", response);
            }
        })
        .catch(error => console.error("Error al obtener zonas:", error));
    }, []);

    if (!Array.isArray(zonas)) {
        console.error("El valor de 'zonas' no es un array:", zonas);
        return <div>Error: No se pudieron cargar las zonas.</div>;
    }

    return (
        <MapList  zonas={zonas} setZonas={setZonas} />
    )
}