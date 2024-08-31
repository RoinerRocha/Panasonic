import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Zona } from "../../app/models/zone";
import { newAssetModels } from "../../app/models/newAssetModels";
import { useState, useEffect } from "react";
import api from "../../app/api/api"
import React from "react";

export default function MapDetails(){
    const {id} = useParams<{id: string}>();
    const [zona, setZona] = useState<Zona | null>(null);
    const [assets, setAssets] = useState<newAssetModels[]>([]);

    useEffect(() => {
        const loadZona = async () => {
            try {
                const response = await api.Zones.getZonaById(parseInt(id as string));  // Parsear id a número
                setZona(response.data);
            } catch (error) {
                console.error("Error al cargar la zona:", error);
            }
        };

        if (id) loadZona();
    }, [id]);

    useEffect(() => {
        if (zona) {
            const loadAssetsByZona = async () => {
                try {
                    const response = await api.newAsset.searchAssetsByZona(zona.nombreZona);
                    console.log("Activos obtenidos:", response.data);
                    setAssets(response.data);
                } catch (error) {
                    console.error("Error al cargar los activos:", error);
                }
            };

            loadAssetsByZona();
        }
    }, [zona]);

    if (!zona) {
        return <Typography variant="body1">Cargando datos...</Typography>;
    }


    return (
        <div>
            <Typography variant="h2">Map Detail</Typography>
            <Typography variant="h6">Nombre de la Zona: {zona.nombreZona}</Typography>
            <Typography variant="body1">Número de Zona: {zona.numeroZona}</Typography>
            <Typography variant="body1">Responsable: {zona.responsableAreaNom_user}</Typography>
            {/* Aquí puedes agregar más detalles de la zona */}
            <div>
                <Typography variant="h4">Activos Relacionados:</Typography>
                {assets.length > 0 ? (
                    assets.map((asset) => (
                        <div key={asset.id}>
                            <Typography variant="h6">Numero de la placa: {asset.NumeroPlaca}</Typography>
                            <Typography variant="body1">Numero de Boleta: {asset.NumeroBoleta}</Typography>
                            {/* Aquí puedes agregar más detalles del activo */}
                        </div>
                    ))
                ) : (
                    <Typography variant="body1">No hay activos relacionados para esta zona.</Typography>
                )}
            </div>
        </div>

        

        
    )
}