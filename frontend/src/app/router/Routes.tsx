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
import AssetRetirement from "../../features/assetRetirement/assetRetirementFrm"; 


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
      { path: "RegisterAsset", element: <RegisterAssets/>},
      { path: "AssetRetirement", element: <AssetRetirement/>},//frm
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
