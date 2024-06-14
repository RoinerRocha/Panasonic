// src/components/RegisterAssetsContainer.tsx

import React, { useState, useEffect } from 'react';
import RegisterAssets from '../features/NewAsset/registerAsset';
import { newAssetModels } from '../app/models/newAssetModels';
import { accountingAccount } from '../app/models/accountingAccount';
import { serviceLifeModels } from '../app/models/serviceLifeModels';
import { statusAssets } from '../app/models/statusAsset';
import { Zona } from '../app/models/zone';
import api from "../app/api/api"; 

const RegisterAssetsContainer = () => {
  const [newAssets, setNewAssets] = useState<newAssetModels[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [accountingAccounts, setAccountingAccounts] = useState<accountingAccount[]>([]);
  const [serviceLifes, setServiceLifes] = useState<serviceLifeModels[]>([]);
  const [statusAssets, setStatusAssets] = useState<statusAssets[]>([]);

  useEffect(() => {
    // Cargar datos de zonas, cuentas, etc., al montar el componente
    const fetchData = async () => {
      try {
        const zonasData = await api.Zones.getZona();
        setZonas(zonasData);
        const accountingAccountsData = await api.AcountingAccounts.getAccountingAccounts();
        setAccountingAccounts(accountingAccountsData);
        const serviceLifesData = await api.serviceLife.getServiceLifes();
        setServiceLifes(serviceLifesData);
        const statusAssetsData = await api.statusAssets.getStatusAssets();
        setStatusAssets(statusAssetsData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <RegisterAssets
      newAssets={newAssets}
      setNewAssets={setNewAssets}
      zonas={zonas}
      setZonas={setZonas}
      accountingAccounts={accountingAccounts}
      setAccountingAccounts={setAccountingAccounts}
      serviceLifes={serviceLifes}
      setServiceLifes={setServiceLifes}
      statusAssets={statusAssets}
      setStatusAssets={setStatusAssets}
    />
  );
};

export default RegisterAssetsContainer;
