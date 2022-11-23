import React, { createContext } from "react";
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';

import useToken from './useToken';
import Login from "../pages/Login";



const AuthContext = createContext();

function AuthProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const { token, setToken } = useToken();

    if(token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    function requestLogin(email, password) {
        axios.post(`/login`, {
            email: email,
            password: password
        }).then(res => {
            setToken(res.data);
            console.log("Successfully logged in!");
            navigate("/");
        }).catch(err => {
            if (err.response.status === 401) {
                console.info("Username or password incorrect!");
            } else {
                console.error(err);
            }
        })
    }

    async function signIn(email, password) {
        console.log(email, password);
        const token = await requestLogin(email, password);
        //setToken(token); //FIXME: only one setToken call (see line 27)

        const origin = location.state?.from?.pathname || '/';
        navigate(origin);

        // return login status
        return true;
        // return false;
    }

    function signOut() {
        // setToken(null);
        navigate("/");
    }



    const contextValue = {
        token,
        signIn,
        signOut
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

const ProtectedRoutes = () => {
    const { token, setToken } = useToken();

    if (token) {
        return <Outlet />;
    } else {
        return <Login />
    }
};


export {
    AuthProvider,
    ProtectedRoutes
}

export default AuthContext;
