import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const useAllTopupReq = () => {
    const axiosSecure = useAxiosSecure()

    const {data: topupReq = [],isLoading, refetch} = useQuery({
        queryKey: ['topupReqs'],
        queryFn: async() => {
            const res = await axiosSecure.get(`/topup/requests`)
            return res.data
        }
    })

    return [topupReq,isLoading, refetch];
};

export default useAllTopupReq;