import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaMoneyBillWave, FaCalendarDay, FaUser, FaUserTie } from "react-icons/fa";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";


const RecentTransaction = () => {
    const { user } = useContext(AuthContext);
    const [limit, setLimit] = useState(10);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        if (user) {
            if (user.role === 'user') {
                setLimit(10);
            } else if (user.role === 'agent') {
                setLimit(20);
            }
    }}, [user]);

    const fetchTransactions = async () => {
        if (user) {
            const { data } = await axiosSecure.get(`/user/transactions/${user.number}/${limit}`);
            return data;
        }
        return [];
    };

    const { data: transactions = [], isLoading, isError } = useQuery(
        {
            queryKey:['transactions', user?.number, limit],
            queryFn: fetchTransactions
        }
    );

    const formatDate = (date) => {
        return format(new Date(date), 'dd MMM yyyy HH:mm');
    };

    const getNumber = (transaction)=>{
        console.log(transaction)
        if(transaction.senderName !== user?.name){
            return `${transaction.sender} (${transaction.senderName})`
        }
        else{
            return `${transaction.receiver}`
        }
    }

    const getColor = (transaction) => {
        if(transaction.type === 'Cash Out'){
            return user.role === 'user'? 'bg-red-300 text-red-800': 'bg-green-300 text-green-800'
        }
        if(transaction.type === 'Cash In'){
            return user.role === 'user'? 'bg-green-300 text-green-800': 'bg-red-300 text-red-800'
        }
        if(transaction.senderName !== user?.name){
            return 'bg-green-200 text-green-800'
        }
        return 'bg-red-200 text-red-800'
    }

    const getType = (transaction)=>{
        if(transaction.type==='Send Money' && transaction.senderName !== user?.name){
            return 'Money Recieved'
        }
        return transaction.type
    }


    return (
        <div className="w-full flex flex-col items-center p-4">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex flex-col items-center justify-center bg-primary w-full h-16 p-4 text-white">
                    <h1 className="text-xl font-bold">Recent Transactions</h1>
                </div>
                {isLoading && (
                    <div className="flex w-full justify-center items-center">
                    <span className="loading loading-infinity loading-lg text-primary"></span>
                    </div>
                )}
                
                {isError && (
                    <div className="p-6">
                    <p className="text-center text-red-500">Error fetching transactions. Please try again</p>
                    </div>
                )}

                {transactions && (
                    <div className="p-6">
                    {(transactions.length === 0 && !isLoading) ? (
                        <p className="text-center text-gray-500">No transactions found</p>
                    ) : (
                        <div className="space-y-4">
                            {transactions.map((transaction) => (
                                <div
                                key={transaction._id}
                                className="p-4 bg-white shadow-sm border rounded-lg flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 border-l-4 border-primary"
                            >
                                <div className="flex-1 space-y-1">
                                    <div className="text-sm text-gray-600 font-medium flex justify-start items-center">
                                        <div className="inline text-primary mr-1">{transaction.type === 'Send Money'? <FaUser />: <FaUserTie />}</div>
                                        <p> {getNumber(transaction)}
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-500 flex justify-start items-center">
                                        <FaMoneyBillWave className="inline text-primary mr-1" />
                                        <p>{transaction.amount} tk</p>
                                    </div>
                                    <div className="text-xs text-gray-500 flex justify-start items-center">
                                        <FaCalendarDay className="inline text-primary mr-1" />
                                        <p>{formatDate(transaction.date)}</p>
                                    </div>
                                </div>
                                {transaction.type && (
                                    <div className={`px-3 py-1 text-xs font-bold rounded-md ${getColor(transaction)}
                                    `}>
                                        {getType(transaction)}
                                    </div>
                                )}
                            </div>
                            
                            ))}
                        </div>
                    )}
                </div>
                )}
            </div>
        </div>
    );
};

export default RecentTransaction;
