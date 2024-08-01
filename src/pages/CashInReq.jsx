import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FaMoneyBillWave, FaCalendarDay, FaUser } from "react-icons/fa";
import { format } from "date-fns";
import { toast } from "sonner";

const CashInReq = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const fetchCashInRequests = async () => {
        if (user) {
            const { data } = await axiosSecure.get(`/cash-in-requests/${user?.number}/${user?.email}`);
            return data;
        }
        return [];
    };

    const { data: requests = [], isLoading, isError, refetch } = useQuery(
        {
            queryKey: ['cashInRequests', user?.number],
            queryFn: fetchCashInRequests
        }
    );

    const approveCashIn = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosSecure.post(`/cash-in-requests/approve`,{id});
            return data;
        },
        onSuccess: () => {
            refetch()
            toast.success("Cash In Request Approved");
        },
        onError: () => {
            toast.error("Error Approving Cash In Request");
        }
    });

    const handleApprove = (requestId) => {
        approveCashIn.mutate(requestId);
    };


    const declineCashIn = useMutation({
        mutationFn: async (requestId) => {
            const { data } = await axiosSecure.delete(`/cash-in-requests/decline/${requestId}`);
            return data;
        },
        onSuccess: () => {
            refetch()
            toast.success('Cash In Request Declined')
        },
        onError: () => {
            toast.error('Error Declining Cash In Request')
        }
    }) 

    const handleDecline = (requestId) => {
        declineCashIn.mutate(requestId);
    }

    const formatDate = (date) => {
        return format(new Date(date), 'dd MMM yyyy HH:mm');
    };

    return (
        <div className="w-full flex flex-col items-center p-4">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex flex-col items-center justify-center bg-primary w-full h-16 p-4 text-white">
                    <h1 className="text-xl font-bold">Cash In Requests</h1>
                </div>
                {isLoading && (
                    <div className="flex w-full justify-center items-center">
                        <span className="loading loading-infinity loading-lg text-primary"></span>
                    </div>
                )}
                {isError && (
                    <div className="p-6">
                        <p className="text-center text-red-500">Error fetching cash-in requests. Please try again</p>
                    </div>
                )}
                {requests && (
                    <div className="p-6">
                        {(requests.length === 0 && !isLoading) ? (
                            <p className="text-center text-gray-500">No cash-in requests found</p>
                        ) : (
                            <div className="space-y-4">
                                {requests.map((request) => (
                                    <div
                                        key={request._id}
                                        className="p-4 bg-white shadow-sm border rounded-lg flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 border-l-4 border-primary"
                                    >
                                        <div className="flex-1 space-y-1">
                                            <div className="text-sm text-gray-600 font-medium flex justify-start items-center">
                                                <FaUser className="inline text-primary mr-1" />
                                                <p>From: {request.senderName} ({request.sender})</p>
                                            </div>
                                            <div className="text-sm text-gray-500 flex justify-start items-center">
                                                <FaMoneyBillWave className="inline text-primary mr-1" />
                                                <p>{request.amount} tk</p>
                                            </div>
                                            <div className="text-xs text-gray-500 flex justify-start items-center">
                                                <FaCalendarDay className="inline text-primary mr-1" />
                                                <p>{formatDate(request.date)}</p>
                                            </div>
                                        </div>
                                        <div className=" space-x-2">
                                        <button
                                            className="px-3 py-1 text-xs font-bold rounded-md bg-green-200 text-green-800 hover:bg-green-300"
                                            onClick={() => handleApprove(request._id)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="px-3 py-1 text-xs font-bold rounded-md bg-red-200 text-red-800 hover:bg-red-300"
                                            onClick={() => handleDecline(request._id)}
                                        >
                                            Decline
                                        </button>
                                        </div>
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

export default CashInReq;
