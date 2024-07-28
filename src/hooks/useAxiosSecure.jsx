import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

const useAxiosSecure = () => {
    const {logOut} = useContext(AuthContext);
    const naivgate = useNavigate();

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
            logOut();
            localStorage.removeItem('token');
            naivgate('/');
        }
        return Promise.reject(error);
    });
    
    return axiosSecure;
};

export default useAxiosSecure;