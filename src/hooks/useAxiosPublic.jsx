import axios from "axios";

const useAxiosPublic = () => {
    const axiosPublic = axios.create({
        baseURL: 'http://localhost:3001'
    });

    return axiosPublic;
};

export default useAxiosPublic;