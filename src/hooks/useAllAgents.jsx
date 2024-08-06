import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useAllAgents = () => {
    const axiosSecure = useAxiosSecure()

    const {data: agents = [], refetch} = useQuery({
        queryKey: ['agents'],
        queryFn: async() => {
            const res = await axiosSecure.get(`/users/agent`)
            return res.data
        }
    })
    return [agents, refetch];
};

export default useAllAgents;