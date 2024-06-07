import { useEffect, useState } from "react";
import api from "../../app/api/api";
import { serviceLifeModels } from "../../app/models/serviceLifeModels";
import  ServiceLifeList from "./serviceLifeList";

export default function ServiceLife() {
  const [serviceLife, setserviceLife] = useState<serviceLifeModels[]>([]);

  useEffect(() => {
    api.serviceLife
      .getServiceLifes()
      .then((response) => {
        // Verificamos si la respuesta es un objeto con la propiedad 'data' que es un array
        if (response && Array.isArray(response.data)) {
          // Asignamos el array de Lista Ministero de Hacienda a setServiceLife
          setserviceLife(response.data);
        } else {
          console.error(
            "La respuesta de la API no es un array de Lista Ministero de Hacienda:",
            response
          );
        }
      })
      .catch((error) =>
        console.error("Error al obtener Lista Ministero de Hacienda:", error)
      );
  }, []);

  if (!Array.isArray(serviceLife)) {
    console.error(
      "El valor de Lista Ministero de Hacienda no es un array:",
      serviceLife
    );
    return (
      <div>Error: No se pudieron cargar la Lista Ministero de Hacienda .</div>
    );
  }
  return (
    <>
      < ServiceLifeList serviceLifes={serviceLife} setServiceLifes={setserviceLife}/>
    </>
  );
}
