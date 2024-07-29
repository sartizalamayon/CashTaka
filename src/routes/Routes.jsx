import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";


export const router = createBrowserRouter([{
    path: "/",
    element: <Root />,
    errorElement: <p>404</p>,
    children: [
        {
            path: "/",
            element: <Home/>,
        },
        {
            path: "/dashboard",
            element: <Dashboard/>,
        },
    ]
}])