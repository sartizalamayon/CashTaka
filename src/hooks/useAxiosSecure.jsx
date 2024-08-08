import axios from "axios";
const axiosSecure = axios.create({
    baseURL: 'https://cash-taka-server.vercel.app',
    withCredentials: true
});

const useAxiosSecure = () => {

    axiosSecure.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        config.headers.authorization = `Bearer ${token}`;
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    axiosSecure.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        const status = error.response ? error.response.status : null;
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    });
    
    return axiosSecure;
};

export default useAxiosSecure;