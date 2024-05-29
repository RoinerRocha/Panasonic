import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import AboutPage from "../../features/about/About";
import Zone from "../../features/Zone/Zone";
import NewZone from "../../features/Zone/NewZone";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {path: '', element: <HomePage />},
            {path: 'login', element: <Login />},
            {path: 'register', element: <Register />},
            {path: 'zonas', element: <Zone />},
            {path: 'nuevaZona', element: <NewZone />},
            {path: 'about', element: <AboutPage />}
        ]
    }
])