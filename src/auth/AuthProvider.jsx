import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useMutation } from "@tanstack/react-query";
import { toast } from 'sonner';
import useAxiosSecure from "../hooks/useAxiosSecure";


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)

  const newUser = useMutation({
    mutationFn: (user) => {
      return axiosPublic.post('/users', user)
    }
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosSecure.get('/user');
        setUser(res.data.user);
      } catch (error) {
        //console.error(error);
      } finally{
        setLoading(false)
      }
    };
    fetchUser();
  }, [axiosSecure, user]);

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
      balance: data.role==="agent"? 10000 : 40,
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

  const lastLogin = useMutation({
    mutationFn: (number)=>{
      return axiosPublic.patch(`/user/lastlogin/${number}`)
    }
  })

  const login = async (data, navigate) => {
    setLoading(true)
    const userData = {
      user : data.info,
      pin : data.pin
    }
    try{
      const res = await axiosPublic.post('/login', userData)
      const usr = res?.data?.user
      if(!usr.isPending){
        localStorage.setItem('token', res.data.token);
        setUser(usr)
        toast.success('Login Successful');
        navigate('/dashboard/')
        if(usr.lastLogin === ''){
          toast.success('Welcome to CashTaka', {
            description: `You have received a one time welcome bonus ${res.data.user.role === 'agent'? '10,000':'40'} Taka.`
          })
        }
        lastLogin.mutate(usr.number)
        
      }else if(res.data.user.isPending){
        toast.error('Login Failed', {
          description: 'Your account is still pending approval. Please try again later.'
      })
      }
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
