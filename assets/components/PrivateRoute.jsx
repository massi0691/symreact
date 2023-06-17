import React from "react";
import AuthContext from "../contexts/AuthContext";
import {Navigate} from "react-router-dom";
import {useContext} from "react";

const ProtectedRoute = ({children}) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated === false ? <Navigate to="/login"/> : children
}


export default ProtectedRoute;
