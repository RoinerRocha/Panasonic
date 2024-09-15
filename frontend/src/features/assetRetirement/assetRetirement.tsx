import { useEffect, useState } from "react";
import api from "../../app/api/api";
import { assetRetirementModel } from "../../app/models/assetRetirementModel";
import AssetRetirementList from "../assetRetirement/assetRetirementList";

export default function AssetRetirement() {
    const [assetRetirement, setAssetRetirement] = useState<assetRetirementModel[]>([]);

    useEffect(() =>{
        api.assetRetirement
            .getAssetRetirements()
            .then((response) => {
                if (response && Array.isArray(response.data)) {
                    setAssetRetirement(response.data);
                } else {
                    console.error(
                      "La respuesta de la API no es un array de Baja de Activos:",
                      response
                    );
                }
            })
            .catch((error) =>
                console.error("Error al obtener Baja de Activos:", error)
            );
    }, []);

    if (!Array.isArray(assetRetirement)) {
        console.error("El valor de la Baja de Activos no es un array:", assetRetirement);
        return <div>Error: No se pudieron cargar las Bajas de Activos.</div>;
    }

    return (
        <>
          <AssetRetirementList assetRetirements={assetRetirement} setAssetRetirements={setAssetRetirement} />
        </>
    );
}