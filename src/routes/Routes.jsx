import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import SendMoney from "../pages/SendMoney";
import CashOut from "../pages/CashOut"
import CashIn from "../pages/CashIn"
import RecentTransaction from "../pages/RecentTransaction"
import CashInReq from "../pages/CashInReq"
import ManageUsers from "../pages/ManageUsers"
import ManageAgents from "../pages/ManageAgents"
import AllTransactions from "../pages/AllTransactions"
import Withdraw from "../pages/Withdraw";
import Topup from "../pages/Topup";
import Profile from "../pages/Profile";
import TopupReq from "../pages/TopupReq";
import AdminRoute from "./AdminRoute";
import AgentRoute from "./AgentRoute";
import UserRoute from "./UserRoute";


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
            path: "/dashboard",
            element: <Profile/>,
          },
          {
            path: "send-money",
            element: <UserRoute><SendMoney/></UserRoute>,
          },
          {
            path: "cash-out",
            element: <UserRoute><CashOut/></UserRoute>,
          },
          {
            path: "cash-in",
            element: <UserRoute><CashIn/></UserRoute>,
          },
          {
            path: "recent-transactions",
            element: <RecentTransaction/>,
          },
          {
            path: "topup",
            element: <AgentRoute><Topup/></AgentRoute>,
          },
          {
            path: "withdraw",
            element: <AgentRoute><Withdraw/></AgentRoute>,
          },
          {
            path: "cash-in-requests",
            element: <AgentRoute><CashInReq/></AgentRoute>,
          },
          {
            path: "manage-users",
            element: <AdminRoute><ManageUsers/></AdminRoute>,
          },
          {
            path: "manage-agents",
            element: <AdminRoute><ManageAgents/></AdminRoute>,
          },
          {
            path: "all-transactions",
            element: <AdminRoute><AllTransactions/></AdminRoute>,
          },
          {
            path: "topup-requests",
            element: <AdminRoute><TopupReq/></AdminRoute>,
          },
        ],
      },
    ],
  },
]);
