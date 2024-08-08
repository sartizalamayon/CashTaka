import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const UserRoute = ({children}) => {
    const {user} = useContext(AuthContext);
    if(user?.role === "user"){
        return children;
    }
    return <Navigate to="/dashboard" replace/>
};

UserRoute.propTypes = {
    children: PropTypes.node,
};

export default UserRoute;