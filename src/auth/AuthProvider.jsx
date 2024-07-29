import { createContext, useState } from "react";
import PropTypes from "prop-types";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useMutation } from "@tanstack/react-query";
import { toast } from 'sonner';


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const axiosPublic = useAxiosPublic();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false)

  const newUser = useMutation({
    mutationFn: (user) => {
      return axiosPublic.post('/users', user)
    }
  })

  const signup = async (data, reset, setCurr) => {
    setLoading(true);
    const user = {
      name: data.name,
      email: data.email,
      number: data.number,
      pin: data.newPin,
      date: new Date().toISOString(),
      role: data.role,
      isPending: true,
      balance: 40,
      lastLogin: "",
    };
    console.log(user)
    newUser.mutate(user, {
      onSuccess: (data) => {
        setLoading(false);
        console.log(data.data)
        if(data.data.success){
          toast.success('Account Created Successfully', {
            description: 'You can login after your account is approved.'
          });
          reset();
          setCurr('login');
        }
        else{
          toast.error('Error Creating Account',{
            description: data.data.message
          });
        }
      },
      onError: (error) => {
        setLoading(false);
        toast.error('Error Creating Account', {
          description: `${error.message}. Please try again later`
        });
      }
    });
  }

  const login = async (data, navigate) => {
    setLoading(true)
    const userData = {
      user : data.info,
      pin : data.pin
    }
    console.log(user)
    try{
      const res = await axiosPublic.post('/login', userData)
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user)
      toast.success('Login Successful');
      navigate('/dashboard/')
    }catch(error){
      console.log(error.response)
      toast.error('Login Failed', {
        description: `${error?.response?.data?.message || error?.message}.`,
      });
    }finally{
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login,signup, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
export default AuthProvider;
