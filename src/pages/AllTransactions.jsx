import { useState, useEffect } from "react";
import useTransactions from "../hooks/useTransactions";
import { FaUser, FaExchangeAlt, FaCalendarAlt, FaMoneyBillAlt, FaFilter } from "react-icons/fa";

const AllTransactions = () => {
    const [allTransactions, isLoading] = useTransactions();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filterType, setFilterType] = useState("");

    // Function to handle search
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        filterTransactions(term, filterType);
    };

    // Function to handle filter
    const handleFilter = (type) => {
        setFilterType(type);
        filterTransactions(searchTerm, type);
    };

    // Function to filter transactions
    const filterTransactions = (term, type) => {
        const filtered = allTransactions.filter(transaction => {
            const matchesSearch = transaction.sender.toLowerCase().includes(term) || transaction.receiver.toLowerCase().includes(term);
            const matchesType = type ? transaction.type === type : true;
            return matchesSearch && matchesType;
        });
        setFilteredTransactions(filtered);
    };

    // Update filtered transactions when allTransactions changes
    useEffect(() => {
        filterTransactions(searchTerm, filterType);
    }, [allTransactions]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
                <span className="loading loading-infinity loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center p-4">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex flex-col items-center justify-center bg-primary w-full h-16 p-4 text-white">
                    <h1 className="text-xl font-bold">All Transactions</h1>
                </div>
                <div className="p-6">
                    <input
                        type="text"
                        placeholder="Search by number or email"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-2 border rounded-lg mb-4 bg-gray-100"
                    />
                    <div className="flex justify-center mb-4 space-x-2">
                        {['Send Money', 'Cash In', 'Cash Out', 'Withdraw', 'Topup'].map(type => (
                            <button
                                key={type}
                                className={`px-3 py-1 text-xs font-bold rounded-md ${filterType === type ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                                onClick={() => handleFilter(type)}
                            >
                                <FaFilter className="inline mr-1" /> {type}
                            </button>
                        ))}
                        <button
                            className={`px-3 py-1 text-xs font-bold rounded-md ${!filterType ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                            onClick={() => handleFilter('')}
                        >
                            <FaFilter className="inline mr-1" /> All
                        </button>
                    </div>
                    {filteredTransactions.length === 0 ? (
                        <p className="text-center text-gray-500">No transactions found</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredTransactions.map((transaction) => (
                                <div
                                    key={transaction._id}
                                    className="p-4 bg-white shadow-sm border rounded-lg flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 border-l-4 border-primary"
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="text-sm text-gray-600 font-medium flex justify-start items-center">
                                            <FaUser className="inline text-primary mr-1" />
                                            <p>Sender: {transaction.sender}</p>
                                        </div>
                                        <div className="text-sm text-gray-600 font-medium flex justify-start items-center">
                                            <FaUser className="inline text-primary mr-1" />
                                            <p>Receiver: {transaction.receiver}</p>
                                        </div>
                                        <div className="text-sm text-gray-500 flex justify-start items-center">
                                            <FaExchangeAlt className="inline text-primary mr-1" />
                                            <p>Type: {transaction.type}</p>
                                        </div>
                                        <div className="text-sm text-gray-500 flex justify-start items-center">
                                            <FaCalendarAlt className="inline text-primary mr-1" />
                                            <p>Date: {new Date(transaction.date).toLocaleString()}</p>
                                        </div>
                                        <div className="text-sm text-gray-500 flex justify-start items-center">
                                            <FaMoneyBillAlt className="inline text-primary mr-1" />
                                            <p>Amount: {transaction.amount} tk</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllTransactions;
