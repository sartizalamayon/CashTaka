import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useAllTransactions = () => {
    const {user} = useContext(AuthContext)
    const axiosSecure = useAxiosSecure()

    const {data: transactions = [],isLoading, refetch} = useQuery({
        queryKey: [user, user?.number, user?.balance],
        queryFn: async() => {
            const res = await axiosSecure.get(`/user/alltransactions/${user?.email}/${user?.number}`)
            return res.data
        }
    })

    return [transactions,isLoading, refetch];
};

export default useAllTransactions;