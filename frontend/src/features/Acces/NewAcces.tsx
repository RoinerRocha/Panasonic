import { useEffect, useState } from "react";
import api from "../../app/api/api";
import { accessModel } from "../../app/models/access";
import AccessList from "./accessList";

export default function Access() {
    const [access, setAccess] = useState<accessModel[]>([]);

    useEffect(() => {
        api.access
          .getAccess()
          .then((response) => {
            // Verificamos si la respuesta es un objeto con la propiedad 'data' que es un array
            if (response && Array.isArray(response.data)) {
              // Asignamos el array de perfiles de usuario a setPerfile
              setAccess(response.data);
            } else {
              console.error(
                "La respuesta de la API no es un array de acceso:",
                response
              );
            }
          })
          .catch((error) =>
            console.error("Error al obtener el acceso:", error)
          );
    }, []);

    if (!Array.isArray(access)) {
        console.error("El valor del acceso no es un array:", access);
        return <div>Error: No se pudieron cargar los Perfil de Usuario.</div>;
    }

    return (
        <>
          <AccessList accesses={access} setAccesses={setAccess} />
        </>
      );
}