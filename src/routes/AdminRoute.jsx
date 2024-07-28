import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

const AdminRoute = ({children}) => {
    const role = "admin";
    if(role === "admin"){
        return children;
    }
    return <Navigate to="/dashboard" replace/>
};

AdminRoute.propTypes = {
    children: PropTypes.node,
};

export default AdminRoute;