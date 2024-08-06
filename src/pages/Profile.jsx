import { useContext, useMemo } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { SiTicktick, SiMaildotru } from "react-icons/si";
import { format } from "date-fns";
import useAllTransactions from "../hooks/useAllTransactions";
import { BiCalendar, BiPhone } from "react-icons/bi";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [transactions, isLoading] = useAllTransactions();

  const totalTransactionAmount = useMemo(() => {
    return transactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;
  }, [transactions]);

  const formatDate = (date) => {
    if (date) {
      return format(new Date(date), "dd MMM yyyy HH:mm");
    }
    return "";
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-20">
        <p>Building your Profile</p>
        <span className="loading loading-infinity loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className=" flex flex-col md:flex-row justify-between items-stretch gap-6">
      {/* User Data */}
      <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4">
        <h2 className="text-3xl font-bold mb-4 text-primary">Profile Information</h2>
        <div className="mb-4 space-y-2 text-gray-800">
          <div className="flex items-center text-lg">
            <SiTicktick className="text-primary mr-2" />
            <p><strong>Name:</strong> {user?.name}</p>
          </div>
          <div className="flex items-center text-lg">
            <SiMaildotru className="text-primary mr-2" />
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
          <div className="flex items-center text-lg">
            <BiPhone className="text-primary mr-2" />
            <p><strong>Phone Number:</strong> {user?.number}</p>
          </div>
          <div className="flex items-center text-lg">
            <SiTicktick className="text-primary mr-2" />
            <p><strong>Balance:</strong> {user?.balance}</p>
          </div>
          <div className="flex items-center text-lg">
            <BiCalendar className="text-primary mr-2" />
            <p><strong>Account Created:</strong> {formatDate(user?.date)}</p>
          </div>
          <div className="flex items-center text-lg">
            <BiCalendar className="text-primary mr-2" />
            <p><strong>Last Login:</strong> {formatDate(user?.lastLogin)}</p>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold text-primary mb-2">Total Transaction Amount</h3>
          <p className="text-xl font-bold">{totalTransactionAmount}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6 flex flex-col">
        <h2 className="text-3xl font-bold mb-4 text-primary text-center">Timeline</h2>
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical flex-grow">
          <li>
            <div className="timeline-middle mb-1 text-primary">
              <SiTicktick />
            </div>
            <div className="timeline-start mb-10 md:text-end">
              <time className="font-mono italic">{formatDate(user?.date)}</time>
              <div className="text-lg font-black text-primary">Created Account</div>
              <p>You created your account on CashTaka</p>
            </div>
            <hr />
          </li>
          {transactions && transactions.length > 0 && (
            <>
              <li>
                <hr />
                <div className="timeline-middle mb-1 mt-1 text-primary">
                  <SiTicktick />
                </div>
                <div className="timeline-end mb-10">
                  <time className="font-mono italic">{formatDate(transactions[transactions.length - 1].date)}</time>
                  <div className="text-lg font-black text-primary">First Transaction</div>
                  <p>{transactions[transactions.length - 1].type}: {transactions[transactions.length - 1].amount}</p>
                </div>
                <hr />
              </li>
              <li>
                <hr />
                <div className="timeline-middle mb-1 text-primary">
                  <SiTicktick />
                </div>
                <div className="timeline-start mb-10 md:text-end">
                  <time className="font-mono italic">{formatDate(transactions[0].date)}</time>
                  <div className="text-lg font-black text-primary">Most Recent Transaction</div>
                  <p>{transactions[0].type}: {transactions[0].amount}</p>
                </div>
                <hr />
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
