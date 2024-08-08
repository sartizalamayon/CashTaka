import axios from "axios";

const useAxiosPublic = () => {
    const axiosPublic = axios.create({
        baseURL: 'https://cash-taka-server.vercel.app'
    });

    return axiosPublic;
};

export default useAxiosPublic;