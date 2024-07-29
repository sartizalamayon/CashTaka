import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";

const PrivateRoute = ({children}) => {
    const {user} = useContext(AuthContext);

    if (user){
        return children;
    } 
    
    return <Navigate to="/"/>
};

export default PrivateRoute;

PrivateRoute.propTypes = {
    children: PropTypes.node,
};