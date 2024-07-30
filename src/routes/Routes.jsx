import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <p>404</p>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
        children: [
          {
            path: "send-money",
            element: <p>Send Money</p>,
          },
          {
            path: "cash-out",
            element: <p>Cashout</p>,
          },
          {
            path: "cash-in",
            element: <p>Cashin</p>,
          },
          {
            path: "recent-transactions",
            element: <p>recent-transactions</p>,
          },
          {
            path: "cash-out-requests",
            element: <p>Cash out req</p>,
          },
          {
            path: "cash-in-requests",
            element: <p>Cash out req</p>,
          },
          {
            path: "manage-users",
            element: <p>manage-users</p>,
          },
          {
            path: "manage-agents",
            element: <p>manage-agent</p>,
          },
          {
            path: "all-transactions",
            element: <p>all trans</p>,
          },
        ],
      },
    ],
  },
]);
