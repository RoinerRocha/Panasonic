import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import AboutPage from "../../features/about/About";
import Zone from "../../features/Zone/Zone";
import NewZone from "../../features/Zone/NewZone";
import Users from "../../features/account/Users";
import AccountingAccounts from "../../features/accountingAccounts/NewAccount";
import StatusAssets from "../../features/statusAssets/NewStatusAsset";
import Profiles from "../../features/profiles/NewProfile";
import ServiceLife from "../../features/ServiceLife/NewServiceLife"; //lista de Mh
import NewAsset from "../../features/NewAsset/newAsset";
import ResetPassword from "../../features/account/ResetPassword";
import RegisterAssets from "../../features/NewAsset/registerAsset";
import { SetStateAction } from "react";
import { accountingAccount } from "../models/accountingAccount";
import { newAssetModels } from "../models/newAssetModels";
import { serviceLifeModels } from "../models/serviceLifeModels";
import { statusAssets } from "../models/statusAsset";
import { Zona } from "../models/zone";
//import RegisterAssetsContainer from "../../components/RegisterAssetsContainer"; // Importar el contenedor


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "users", element: <Users /> },
      { path: "zonas", element: <Zone /> },
      { path: "nuevaZona", element: <NewZone /> },
      { path: "about", element: <AboutPage /> },
      { path: "NewAccount", element: <AccountingAccounts /> },
      { path: "NewStatusAssets", element: <StatusAssets /> },
      { path: "NewProfiles", element: <Profiles /> },
      { path: "NewServiceLife", element: <ServiceLife /> },
      { path: "NewAsset", element: <NewAsset /> },
      { path: "ResetPassword", element: <ResetPassword />},
      //{ path: "RegisterAsset", element: <RegisterAssetsContainer  />}
      { path: "RegisterAsset", element: <RegisterAssets newAssets={[]} setNewAssets={function (value: SetStateAction<newAssetModels[]>): void {
        throw new Error("Function not implemented.");
      } } zonas={[]} setZonas={function (value: SetStateAction<Zona[]>): void {
        throw new Error("Function not implemented.");
      } } accountingAccounts={[]} setAccountingAccounts={function (value: SetStateAction<accountingAccount[]>): void {
        throw new Error("Function not implemented.");
      } } serviceLifes={[]} setServiceLifes={function (value: SetStateAction<serviceLifeModels[]>): void {
        throw new Error("Function not implemented.");
      } } statusAssets={[]} setStatusAssets={function (value: SetStateAction<statusAssets[]>): void {
        throw new Error("Function not implemented.");
      } } />}
    ],
  },
]);
/**
 * export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Navigate to="login" replace />,
      },
      { path: "/", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "app",
        element: <HomePage />,
        children: [
          { path: "users", element: <Users /> },
          { path: "zonas", element: <Zone /> },
          { path: "nuevaZona", element: <NewZone /> },
          { path: "about", element: <AboutPage /> },
          { path: "NewAccount", element: <AccountingAccounts /> },
          { path: "NewStatusAssets", element: <StatusAssets /> },
          { path: "NewProfiles", element: <Profiles /> },
        ],
      },
    ],
  },
]);
 */
