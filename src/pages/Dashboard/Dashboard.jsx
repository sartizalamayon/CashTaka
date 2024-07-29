import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { HiLogout } from "react-icons/hi";
import { TbCoinTakaFilled, TbPigMoney } from "react-icons/tb";
import { AuthContext } from "../../auth/AuthProvider";
import useBalance from "../../hooks/useBalance";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [balance, balanceRefetch] = useBalance();
  const { logout } = useContext(AuthContext);
  // user - send money, cashin, cashout, transaction(10), balance
  return (
    <div className=" w-full min-h-screen bg-white">
      <Helmet>
        <title>CashTaks - Dashboard</title>
      </Helmet>
      <div>
        {/* Navbar */}
        <div className="bg-primary">
          <div className="navbar container mx-auto">
            <div className="flex-1">
              <button className="flex justify-center items-center gap-1 text-white opacity-95">
                <TbPigMoney className="text-[1.7rem]" />{" "}
                <span className="text-2xl font-mono font-extralight">
                  CashTaka
                </span>
              </button>
            </div>
            <div className="flex-none">
              {user.role !== 'admin' && (
                <div className=" bg-white rounded-xl mr-4 h-9 flex justify-between items-center px-2 gap-1 min-w-24">
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
                className="flex items-center justify-center gap-1 px-3 py-1 h-9 text-md leading-6 text-gray-500 whitespace-no-wrap bg-white border-2 border-transparent shadow-sm hover:bg-transparent hover:text-white hover:border-white focus:outline-none rounded-sm"
              >
                <HiLogout />
                Logout
              </button>
            </div>
          </div>
        </div>
        {/* Content */}
        <div></div>
      </div>
    </div>
  );
};

export default Dashboard;
