import { useContext } from "react";
import useAxiosPublic from "./useAxiosPublic";
import { AuthContext } from "../auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const useBalance = () => {
    const {user} = useContext(AuthContext)
    const axiosPublic = useAxiosPublic()

    const {data: balance = {}, refetch} = useQuery({
        queryKey: [user?.number, user?.balance],
        queryFn: async() => {
            const res = await axiosPublic.get(`/user/balance/${user?.number}`)
            return res.data
        }
    })

    return [balance, refetch];
};

export default useBalance;