import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';

const PrivateRoute = ({children}) => {
    const user = true;
    const loading = false;

    
    const location = useLocation();

    if(loading){
        return <p>Loading...</p>
    }
    if (user){
        return children;
    } 
    return <Navigate to="/" state={{from:location}} replace/>
};

export default PrivateRoute;

PrivateRoute.propTypes = {
    children: PropTypes.node,
};