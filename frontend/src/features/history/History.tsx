import { useEffect, useState } from "react";
import api from "../../app/api/api";
import { assetRetirementModel } from "../../app/models/assetRetirementModel";
import { assetSaleModel } from "../../app/models/assetSaleModel";
import { newAssetModels } from "../../app/models/newAssetModels";
import HistoryTbl from "./historyTbl";

export default function History() {
  const [assetRetirementModels, setAssetRetirementModels] = useState<assetRetirementModel[]>([]);
  const [assetSaleModels, setAssetSaleModels] = useState<assetSaleModel[]>([]);
  const [newAssetModels, setNewAssetModels] = useState<newAssetModels[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.history.getHistory();
        if (Array.isArray(response.data)) {
          setAssetRetirementModels(response.data);
          setAssetSaleModels(response.data);
          setNewAssetModels(response.data);
        } else {
          console.error("La respuesta de la API no es un array del historial de activos:", response);
        }
      } catch (error) {
        console.error("Error al obtener el historial de activos:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <>
      <HistoryTbl
        newAssetModels={newAssetModels}
        setNewAssetModels={setNewAssetModels}
        assetSaleModels={assetSaleModels}
        setAssetSaleModels={setAssetSaleModels}
        assetRetirementModels={assetRetirementModels}
        setAssetRetirementModels={setAssetRetirementModels}
      />
    </>
  );
}