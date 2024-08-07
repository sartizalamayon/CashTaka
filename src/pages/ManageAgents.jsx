import { useState, useEffect } from "react";
import useAllAgents from "../hooks/useAllAgents";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { toast } from "sonner";

const ManageAgents = () => {
    const [agents, refetch] = useAllAgents();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAgents, setFilteredAgents] = useState([]);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        setFilteredAgents(agents);
    }, [agents]);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = agents.filter(agent =>
            agent.name.toLowerCase().includes(term) ||
            agent.email.toLowerCase().includes(term) ||
            agent.number.includes(term)
        );
        setFilteredAgents(filtered);
    };

    const mutation = useMutation(
        {
            mutationFn: async (number) => {
                const { data } = await axiosSecure.patch(`/user/toogle-pending/${number}`);
                return data;
            },
            onSuccess: () => {
                refetch();
                toast.success("User Updated");
            },
            onError: () => {
                toast.error("Error updating user.");
            }
        }
    );

    const togglePendingStatus = (Number) => {
        mutation.mutate(Number);
    };

    return (
        <div className="w-full flex flex-col items-center p-4">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex flex-col items-center justify-center bg-primary w-full h-16 p-4 text-white ">
                    <h1 className="text-xl font-bold">Manage Agents</h1>
                </div>
                <div className="p-6">
                    <input
                        type="text"
                        placeholder="Search by name, email, or number"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-2 border rounded-lg mb-4 bg-gray-100"
                    />
                    {filteredAgents.length === 0 ? (
                        <p className="text-center text-gray-500">No agents found</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredAgents.map((agent) => (
                                <div
                                    key={agent._id}
                                    className={`p-4 bg-white shadow-sm border rounded-lg flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 border-l-4 ${agent.isPending ? 'border-red-500' : 'border-primary'}`}
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="text-sm text-gray-600 font-medium flex justify-start items-center">
                                            <FaUser className="inline text-primary mr-1" />
                                            <p>{agent.name}</p>
                                        </div>
                                        <div className="text-sm text-gray-500 flex justify-start items-center">
                                            <FaEnvelope className="inline text-primary mr-1" />
                                            <p>{agent.email}</p>
                                        </div>
                                        <div className="text-sm text-gray-500 flex justify-start items-center">
                                            <FaPhone className="inline text-primary mr-1" />
                                            <p>{agent.number}</p>
                                        </div>
                                    </div>
                                    <button
                                        className={`px-3 py-1 text-xs font-bold rounded-md ${agent.isPending ? 'bg-red-200 text-red-800 hover:bg-red-300' : 'bg-green-200 text-green-800 hover:bg-green-300'}`}
                                        onClick={() => togglePendingStatus(agent.number)}
                                    >
                                        {agent.isPending ? 'Deactivate' : 'Activate'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageAgents;
