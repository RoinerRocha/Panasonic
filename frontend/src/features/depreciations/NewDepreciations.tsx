import { useEffect, useState } from "react";
import api from "../../app/api/api";
import { depreciationModel } from "../../app/models/depreciationModel";
import Depreciations from "./Depreciations";

export default function Depreciation() {
    const [depreciation, setDepreciation] = useState<depreciationModel[]>([]);

    useEffect(() => {
        api.depreciations
            .getDepreciations()
            .then((response) => {
                if (response && Array.isArray(response.data)) {
                    setDepreciation(response.data);
                } else {
                    console.error(
                        "La respuesta de la API no es un array de Lista depreciaciones:",
                        response
                    );
                }
            })
            .catch((error) =>
                console.error("Error al obtener Lista Ministero de Hacienda:", error)
            );
    }, []);

    return (
        <>
            <Depreciations depreciations={depreciation} setDepreciations={setDepreciation} />
        </>
    );
}

