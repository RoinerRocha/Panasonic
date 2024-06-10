import { useEffect, useState } from "react";
import api from "../../app/api/api";
import { newAssetModels } from "../../app/models/newAssetModels";
import NewAssetsList from "./newAssetList";

export default function NewAsset() {
  const [newAsset, setNewAsset] = useState<newAssetModels[]>([]);

  useEffect(() => {
    api.newAsset
      .getNewAssets()
      .then((response) => {
        // Verificamos si la respuesta es un objeto con la propiedad 'data' que es un array
        if (response && Array.isArray(response.data)) {
          // Asignamos el array de Ingreso de Activos a setNewAsset
          setNewAsset(response.data);
        } else {
          console.error(
            "La respuesta de la API no es un array de Ingreso de Activos:",
            response
          );
        }
      })
      .catch((error) =>
        console.error("Error al obtener Ingreso de Activos:", error)
      );
  }, []);

  if (!Array.isArray(newAsset)) {
    console.error("El valor del Ingreso de Activos no es un array:", newAsset);
    return <div>Error: No se pudieron cargar los Ingrsos de Activos.</div>;
  }

  return (
    <>
      <NewAssetsList newAssets={newAsset} setNewAssets={setNewAsset} />
    </>
  );
}
