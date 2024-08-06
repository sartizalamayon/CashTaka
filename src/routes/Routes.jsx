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
            element: <SendMoney/>,
          },
          {
            path: "cash-out",
            element: <CashOut/>,
          },
          {
            path: "cash-in",
            element: <CashIn/>,
          },
          {
            path: "recent-transactions",
            element: <RecentTransaction/>,
          },
          {
            path: "topup",
            element: <Topup/>,
          },
          {
            path: "withdraw",
            element: <Withdraw/>,
          },
          {
            path: "cash-in-requests",
            element: <CashInReq/>,
          },
          {
            path: "manage-users",
            element: <ManageUsers/>,
          },
          {
            path: "manage-agents",
            element: <ManageAgents/>,
          },
          {
            path: "all-transactions",
            element: <AllTransactions/>,
          },
          {
            path: "topup-requests",
            element: <TopupReq/>
          },
        ],
      },
    ],
  },
]);
