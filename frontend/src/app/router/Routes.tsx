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

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {path: '', element: <HomePage />},
            {path: 'login', element: <Login />},
            {path: 'register', element: <Register />},
            {path: 'users', element: <Users />},
            {path: 'zonas', element: <Zone />},
            {path: 'nuevaZona', element: <NewZone />},
            {path: 'about', element: <AboutPage />},
            {path: 'NewAccount', element: <AccountingAccounts />}
        ]
    }
])