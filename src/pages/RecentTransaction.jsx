import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaMoneyBillWave, FaUser, FaCalendarDay } from "react-icons/fa";
import { format } from "date-fns";
import Swal from "sweetalert2";

const RecentTransaction = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [limit, setLimit] = useState(10);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        if (user) {
            if (user.role === 'user') {
                setLimit(10);
            } else if (user.role === 'agent') {
                setLimit(20);
            }

            const fetchTransactions = async () => {
                try {
                    const { data } = await axiosSecure.get(`/user/transactions/${user.number}/${limit}`);
                    setTransactions(data);
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Failed to fetch transactions. Please try again later.",
                    });
                }
            };

            fetchTransactions();
        }
    }, [user, limit, axiosSecure]);

    const formatDate = (date) => {
        return format(new Date(date), 'dd MMM yyyy HH:mm');
    };

    return (
        <div className="w-full flex flex-col items-center p-4">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex flex-col items-center justify-center bg-primary w-full h-16 p-4 text-white">
                    <h1 className="text-xl font-bold">Recent Transactions</h1>
                </div>
                <div className="p-6">
                    {transactions.length === 0 ? (
                        <p className="text-center text-gray-500">No transactions found</p>
                    ) : (
                        <div className="space-y-4">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction._id}
                                    className="p-4 bg-gray-100 border rounded-lg flex flex-col space-y-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <FaUser className="text-primary" />
                                        <span className="font-semibold">{transaction.senderName}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FaMoneyBillWave className="text-primary" />
                                        <span>Amount: {transaction.amount} tk</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FaCalendarDay className="text-primary" />
                                        <span>Date: {formatDate(transaction.date)}</span>
                                    </div>
                                    {transaction.type && (
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 text-white ${transaction.type === 'Cash Out' ? 'bg-red-500' : 'bg-green-500'} rounded-full`}>
                                                {transaction.type}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecentTransaction;
