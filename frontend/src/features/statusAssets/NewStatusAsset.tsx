import { useEffect, useState } from "react"
import api from "../../app/api/api"
import { statusAssets } from "../../app/models/statusAsset"
import StatusLists from "./statusAssetsList";

export default function StatusAsset() {
    const [statusAsset, setStatusAssets] = useState<statusAssets[]>([]);
    
    useEffect(() => {
        api.statusAssets.getStatusAssets()
        .then(response => {
            // Verificamos si la respuesta es un objeto con la propiedad 'data' que es un array
            if (response && Array.isArray(response.data)) {
                // Asignamos el array de Cuentas Contables a setCuentasContables
                setStatusAssets(response.data);
            } else {
                console.error("La respuesta de la API no es un array de Estado de Activos:", response);
            }
        })
        .catch(error => console.error("Error al obtener Estado de Activos:", error));
    }, []);

    if (!Array.isArray(statusAsset)) {
        console.error("El valor de Estado de Activos no es un array:", statusAsset);
        return <div>Error: No se pudieron cargar los Estado de Activos.</div>;
    }

    return (
        <>
           <StatusLists statusAssets={statusAsset} setStatusAssets={setStatusAssets} /> 
        </>
    )
}