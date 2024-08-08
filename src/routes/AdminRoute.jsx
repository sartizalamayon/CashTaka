import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";

const AdminRoute = ({children}) => {
    const {user} = useContext(AuthContext);
    if(user?.role === "admin"){
        return children;
    }
    return <Navigate to="/dashboard" replace/>
};

AdminRoute.propTypes = {
    children: PropTypes.node,
};

export default AdminRoute;