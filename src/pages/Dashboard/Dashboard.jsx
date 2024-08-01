import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { HiLogout } from "react-icons/hi";
import { TbArrowsExchange, TbCash, TbCoinTakaFilled, TbListDetails, TbPig, TbPigMoney } from "react-icons/tb";
import { AuthContext } from "../../auth/AuthProvider";
import useBalance from "../../hooks/useBalance";
import { Link, NavLink, Outlet } from "react-router-dom";
import { FaUserAlt, FaUsers } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [balance] = useBalance();
  const { logout } = useContext(AuthContext);
  return (
    <div className="w-full min-h-screen bg-white">
      <Helmet>
        <title>CashTaka - Dashboard</title>
      </Helmet>
      <div>
        {/* Navbar */}
        <div className="bg-primary">
          <div className="navbar container mx-auto">
            <div className="flex-1">
              <Link to='/dashboard'>
              <button className="flex justify-center items-center gap-1 text-white opacity-95">
                <TbPigMoney className="text-[1.5rem] md:text-[1.7rem]" />{" "}
                <span className="text-xl md:text-2xl font-mono font-extralight">
                  CashTaka
                </span>
              </button></Link>
            </div>
            <div className="flex-none">
              {user.role !== 'admin' && (
                <div className=" bg-white rounded-xl mr-4 h-7 md:h-9 flex justify-between items-center px-2 gap-1 min-w-20 md:min-w-24">
                <div className="h-full flex justify-center items-center flex-1 text-black text-opacity-70 font-medium">
                  {balance.balance}
                </div>
                <span className="text-xl text-primary">
                  <TbCoinTakaFilled />
                </span>
              </div>
              ) 
              }
              <button
                onClick={logout}
                className="flex items-center justify-center gap-1 px-3 py-1 h-7 md:h-9 text-md leading-6 text-gray-500 whitespace-no-wrap bg-white border-2 border-transparent shadow-sm hover:bg-transparent hover:text-white hover:border-white focus:outline-none rounded-sm"
              >
                <HiLogout />
                Logout
              </button>
            </div>
          </div>
        </div>
        {/* Features */}
        <div className="container mx-auto mt-6 px-4 md:px-0">
          {user.role === 'user' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <NavLink to="/dashboard/send-money" className={({ isActive }) =>
                isActive
                  ? "bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col border-b-primary border-b-4 rounded-b-none"
                  : "bg-green-100 hover:bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col"
                } >
                <TbArrowsExchange className="text-3xl md:text-4xl text-green-500 mb-2" />
                <div className="text-sm md:text-lg font-semibold text-green-700 text-center">Send Money</div>
              </NavLink>
              <NavLink to="/dashboard/cash-out" className={({ isActive }) =>
                isActive
                  ? "bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col border-b-primary border-b-4 rounded-b-none"
                  : "bg-green-100 hover:bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col"
                }>
                <TbCash className="text-3xl md:text-4xl text-green-500 mb-2" />
                <div className="text-sm md:text-lg font-semibold text-green-700 text-center">Cash Out</div>
              </NavLink>
              <NavLink to="/dashboard/cash-in" className={({ isActive }) =>
                isActive
                  ? "bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col border-b-primary border-b-4 rounded-b-none"
                  : "bg-green-100 hover:bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col"
                }>
                <TbPig className="text-3xl md:text-4xl text-green-500 mb-2" />
                <div className="text-sm md:text-lg font-semibold text-green-700 text-center">Cash In</div>
              </NavLink>
              <NavLink to="/dashboard/recent-transactions" className={({ isActive }) =>
                isActive
                  ? "bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col border-b-primary border-b-4 rounded-b-none"
                  : "bg-green-100 hover:bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col"
                }>
                <TbListDetails className="text-3xl md:text-4xl text-green-500 mb-2" />
                <div className="text-sm md:text-lg font-semibold text-green-700 text-center">Recent Transactions</div>
              </NavLink>
            </div>
          )}

          {user.role === 'agent' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <NavLink to="/dashboard/cash-in-requests" className={({ isActive }) =>
                isActive
                  ? "bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col border-b-primary border-b-4 rounded-b-none"
                  : "bg-green-100 hover:bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col"
                }>
                <TbPig className="text-3xl md:text-4xl text-green-500 mb-2" />
                <div className="text-sm md:text-lg font-semibold text-green-700 text-center">Cash In Requests</div>
              </NavLink>
              <NavLink to="/dashboard/recent-transactions" className={({ isActive }) =>
                isActive
                  ? "bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col border-b-primary border-b-4 rounded-b-none"
                  : "bg-green-100 hover:bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col"
                }>
                <TbListDetails className="text-3xl md:text-4xl text-green-500 mb-2" />
                <div className="text-sm md:text-lg font-semibold text-green-700 text-center">Recent Transactions</div>
              </NavLink>
              <NavLink to="/dashboard/topup" className={({ isActive }) =>
                isActive
                  ? "bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col border-b-primary border-b-4 rounded-b-none"
                  : "bg-green-100 hover:bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col"
                }>
                <TbCash className="text-3xl md:text-4xl text-green-500 mb-2" />
                <div className="text-sm md:text-lg font-semibold text-green-700 text-center">Top Up</div>
              </NavLink>
              <NavLink to="/dashboard/withdraw" className={({ isActive }) =>
                isActive
                  ? "bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col border-b-primary border-b-4 rounded-b-none"
                  : "bg-green-100 hover:bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col"
                }>
                <TbCash className="text-3xl md:text-4xl text-green-500 mb-2" />
                <div className="text-sm md:text-lg font-semibold text-green-700 text-center">Withdraw</div>
              </NavLink>
              
            </div>
          )}

          {user.role === 'admin' && (
            <div className="grid grid-cols-3 gap-6">
              <NavLink to="/dashboard/manage-users" className={({ isActive }) =>
                isActive
                  ? "bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col border-b-primary border-b-4 rounded-b-none"
                  : "bg-green-100 hover:bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col"
                }>
                <FaUserAlt className="text-3xl md:text-4xl text-green-500 mb-2" />
                <div className="text-sm md:text-lg font-semibold text-green-700 text-center">Manage Users</div>
              </NavLink>
              <NavLink to="/dashboard/manage-agents" className={({ isActive }) =>
                isActive
                  ? "bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col border-b-primary border-b-4 rounded-b-none"
                  : "bg-green-100 hover:bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col"
                }>
                <FaUsers className="text-3xl md:text-4xl text-green-500 mb-2" />
                <div className="text-sm md:text-lg font-semibold text-green-700 text-center">Manage Agents</div>
              </NavLink>
              <NavLink to="/dashboard/all-transactions" className={({ isActive }) =>
                isActive
                  ? "bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col border-b-primary border-b-4 rounded-b-none"
                  : "bg-green-100 hover:bg-green-200 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-center flex-col"
                }>
                <TbListDetails className="text-3xl md:text-4xl text-green-500 mb-2" />
                <div className="text-sm md:text-lg font-semibold text-green-700 text-center">All Transactions</div>
              </NavLink>
            </div>
          )}
        </div>
        
        {/* Feature Content */}
        <div className="container mx-auto mt-12 px-2 md:px-0">
        <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
