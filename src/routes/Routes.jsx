import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";
import Home from "../pages/Home/Home";


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
            element: <p>Dashboard</p>,
            children: [
                {
                    path: "/dashboard/send",
                    element: <p>Dashboard Send</p>,
                },
            ]
        },
    ]
}])