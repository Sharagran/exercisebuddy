import React, { createContext } from "react";
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';

import useToken from './useToken';
import Login from "../pages/Login";



const { Provider, Consumer } = createContext();

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

    async function signIn() {
        const token = await requestLogin(null, null);
        setToken(token);

        const origin = location.state?.from?.pathname || '/';
        navigate(origin);
    }

    function signOut() {
        setToken(null);
        navigate("/");
    }



    const contextValue = {
        token,
        signIn,
        signOut
    }

    return (
        <Provider value={contextValue}>
            {children}
        </Provider>
    )
}

const ProtectedRoutes = () => {
    const { token, setToken } = useToken();

    if (token) {
        return <Outlet />;
    } else {
        return <Login setToken={setToken} />
    }
};


export {
    AuthProvider,
    Consumer as AuthConsumer,

    ProtectedRoutes
}
