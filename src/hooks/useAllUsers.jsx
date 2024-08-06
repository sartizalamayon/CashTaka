import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useAllUsers = () => {
    const axiosSecure = useAxiosSecure()

    const {data: users = [], refetch} = useQuery({
        queryKey: ['normal-users'],
        queryFn: async() => {
            const res = await axiosSecure.get(`/users/user`)
            return res.data
        }
    })

    return [users, refetch];
};

export default useAllUsers;