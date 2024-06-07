import { useEffect, useState } from "react";
import api from "../../app/api/api";
import { profileModels } from "../../app/models/profileModels";
import ProfilesLists from "./profilesList";

export default function Profile() {
  const [profile, setProfile] = useState<profileModels[]>([]);

  useEffect(() => {
    api.profiles
      .getProfiles()
      .then((response) => {
        // Verificamos si la respuesta es un objeto con la propiedad 'data' que es un array
        if (response && Array.isArray(response.data)) {
          // Asignamos el array de perfiles de usuario a setPerfile
          setProfile(response.data);
        } else {
          console.error(
            "La respuesta de la API no es un array de Perfil de Usuario:",
            response
          );
        }
      })
      .catch((error) =>
        console.error("Error al obtener Perfil de Usuario:", error)
      );
  }, []);

  if (!Array.isArray(profile)) {
    console.error("El valor del Perfil de Usuario no es un array:", profile);
    return <div>Error: No se pudieron cargar los Perfil de Usuario.</div>;
  }

  return (
    <>
      <ProfilesLists profiles={profile} setProfiles={setProfile} />
    </>
  );
}
