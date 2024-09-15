import { useEffect, useState } from "react";
import api from "../../app/api/api";
import { assetSaleModel } from "../../app/models/assetSaleModel";
import AssetSalesList from "./salesAssestList"

export default function SalesAssets() {
    const [assetSale, setAssetSale] = useState<assetSaleModel[]>([]);

    useEffect(() =>{
        api.salesAssest
            .getSalesAssets()
            .then((response) => {
                if (response && Array.isArray(response.data)) {
                    setAssetSale(response.data);
                } else {
                    console.error(
                      "La respuesta de la API no es un array de ventas de Activos:",
                      response
                    );
                }
            })
            .catch((error) =>
                console.error("Error al obtener Baja de Activos:", error)
            );
    }, []);

    if (!Array.isArray(assetSale)) {
        console.error("El valor de la Baja de Activos no es un array:", assetSale);
        return <div>Error: No se pudieron cargar las Bajas de Activos.</div>;
    }

    return (
        <>
          <AssetSalesList assetSales={assetSale} setAssetSales={setAssetSale} />
        </>
    );
}