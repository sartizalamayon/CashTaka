import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useTransactions = () => {
    const axiosSecure = useAxiosSecure()

    const {data: allTransactions = [],isLoading, refetch} = useQuery({
        queryKey: ['all-transactions'],
        queryFn: async() => {
            const res = await axiosSecure.get(`/alltransactions`)
            return res.data
        }
    })

    return [allTransactions,isLoading, refetch];
};

export default useTransactions;