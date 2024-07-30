import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";

const PrivateRoute = ({children}) => {
    const {user, loading} = useContext(AuthContext);
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-infinity loading-lg text-primary"></span>
            </div>
        )
    }
    if (user){
        return children;
    } 
    
    return <Navigate to="/"/>
};

export default PrivateRoute;

PrivateRoute.propTypes = {
    children: PropTypes.node,
};