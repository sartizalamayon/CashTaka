import { useContext, useMemo } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { SiTicktick, SiMaildotru } from "react-icons/si";
import { format } from "date-fns";
import useAllTransactions from "../hooks/useAllTransactions";
import { BiCalendar, BiPhone } from "react-icons/bi";
import useAllUsers from "../hooks/useAllUsers";
import useAllAgents from "../hooks/useAllAgents";
import useTransactions from "../hooks/useTransactions";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [transactions, isLoading] = useAllTransactions();
  const [users] = useAllUsers();
  const [agents] = useAllAgents();
  const [allTransactions] = useTransactions();

  const totalTransactionAmount = useMemo(() => {
    return transactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;
  }, [transactions]);

  const fee = useMemo(() => {
    return allTransactions.reduce((accumulator, transaction) => {
      if (transaction.type === 'Withdraw' || transaction.type === "Send Money") {
        return accumulator + transaction.fee;
      }
      return accumulator;
    }, 0);
  }, [allTransactions]);

  const biggestTransaction = useMemo(() => {
    return allTransactions.reduce((maxTransaction, currentTransaction) => {
      return currentTransaction.amount > (maxTransaction?.amount || 0) ? currentTransaction : maxTransaction;
    }, null);
  }, [allTransactions]);

  const allTransactionsAmount = useMemo(() => {
    return allTransactions.reduce((accumulator, transaction) => {
      return accumulator + transaction.amount;
    }, 0);
  }, [allTransactions]);

  const formatDate = (date) => {
    if (date) {
      return format(new Date(date), "dd MMM yyyy HH:mm");
    }
    return "";
  };

  const transactionTypesData = useMemo(() => {
    const typeCounts = allTransactions.reduce((acc, transaction) => {
      acc[transaction.type] = (acc[transaction.type] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(typeCounts).map(type => ({ name: type, value: typeCounts[type] }));
  }, [allTransactions]);

  const transactionsPerUserData = useMemo(() => {
    const userCounts = users.reduce((acc, user) => {
      const userTransactions = allTransactions.filter(tx => tx.sender === user.number || tx.receiver === user.number);
      acc.push({ name: user.name, value: userTransactions.length });
      return acc;
    }, []);
    return userCounts;
  }, [users, allTransactions]);

  const transactionAmountOverTime = useMemo(() => {
    const groupedByDate = allTransactions.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += transaction.amount;
      return acc;
    }, {});
    return Object.keys(groupedByDate).map(date => ({ date, amount: groupedByDate[date] }));
  }, [allTransactions]);

  const transactionsPerTypeOverTime = useMemo(() => {
    const groupedByDateAndType = allTransactions.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = {};
      }
      if (!acc[date][transaction.type]) {
        acc[date][transaction.type] = 0;
      }
      acc[date][transaction.type]++;
      return acc;
    }, {});
    const result = [];
    Object.keys(groupedByDateAndType).forEach(date => {
      Object.keys(groupedByDateAndType[date]).forEach(type => {
        result.push({ date, type, count: groupedByDateAndType[date][type] });
      });
    });
    return result;
  }, [allTransactions]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-20">
        <p>Building your Profile</p>
        <span className="loading loading-infinity loading-lg text-primary"></span>
      </div>
    );
  }

  const COLORS = ['#2ECC71', '#27AE60', '#1ABC9C', '#16A085'];

  return (
    <>
      {user.role !== 'admin' && (
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
      )}

      {user.role === 'admin' && (
        <div className="w-full flex flex-col items-center bg-white shadow-lg rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-primary">Total Fee Collected</h3>
              <p className="text-lg font-bold">{fee}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-primary">Total Users</h3>
              <p className="text-lg font-bold">{users?.length}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-primary">Total Agents</h3>
              <p className="text-lg font-bold">{agents?.length}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-primary">Total Transactions</h3>
              <p className="text-lg font-bold">{allTransactions?.length}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-primary">Biggest Transaction</h3>
              <p className="text-lg font-bold">
                {biggestTransaction?.sender} {biggestTransaction?.type} to {biggestTransaction?.receiver} ${biggestTransaction?.amount}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-primary">Total Transaction Amount</h3>
              <p className="text-lg font-bold">{allTransactionsAmount}</p>
            </div>
          </div>

          {/* Charts and graphs */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="w-full text-center shadow-inner bg-gray-100 rounded-lg py-6">
              <h3 className="text-xl font-bold mb-2 text-primary">Transaction Types</h3>
              <div className="flex justify-center items-center pt-4">
              <PieChart width={300} height={280}>
                <Pie data={transactionTypesData} cx={150} cy={100} outerRadius={80} fill="#8884d8" dataKey="value" label>
                  {transactionTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
              </div>
            </div>

            <div className="w-full text-center shadow-inner bg-gray-100 rounded-lg py-6">
              <h3 className="text-xl font-bold mb-2 text-primary">Transactions per User</h3>
              <div className="flex justify-center items-center pt-4 mr-5">
              <BarChart width={300} height={280} data={transactionsPerUserData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#2ECC71" />
              </BarChart>
              </div>
            </div>

            <div className="w-full shadow-inner bg-gray-100 rounded-lg py-6 text-center">
              <h3 className="text-xl font-bold mb-2 text-primary">Transaction Amount Over Time</h3>
              <div className="flex justify-center items-center pt-4">
              <LineChart width={300} height={280} data={transactionAmountOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#27AE60" activeDot={{ r: 8 }} />
              </LineChart>
              </div>
            </div>

            <div className="w-full shadow-inner bg-gray-100 rounded-lg py-6 text-center">
              <h3 className="text-xl font-bold mb-2 text-primary">Transactions per Type Over Time</h3>
              <div className="flex justify-center items-center pt-4">
              <LineChart width={300} height={280} data={transactionsPerTypeOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#16A085" activeDot={{ r: 8 }} />
              </LineChart>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
