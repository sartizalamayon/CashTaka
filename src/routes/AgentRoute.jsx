import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AgentRoute = ({children}) => {
    const {user} = useContext(AuthContext);
    if(user?.role === "agent"){
        return children;
    }
    return <Navigate to="/dashboard" replace/>
};

AgentRoute.propTypes = {
    children: PropTypes.node,
};

export default AgentRoute;