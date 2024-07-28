import { createContext, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import useAxiosPublic from "../hooks/useAxiosPublic";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const axiosPublic = useAxiosPublic();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false)


  const login = async (data) => {
    // axiosPublic.post('/jwt', user)
    //           .then(res => {
    //             if(res.data.token){
    //               localStorage.setItem('token', res.data.token);
    //             }
    //           })
    // try {
    //   const response = await axios.post("/api/auth/login", { data });
    //   const { token, user } = response.data;
    //   localStorage.setItem("token", token);
    //   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    //   setUser(user);
    // } catch (error) {
    //   console.error(error);
    // }
    console.log(data)
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
export { AuthProvider, AuthContext };
