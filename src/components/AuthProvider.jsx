import React, { createContext } from "react";
import { Outlet } from 'react-router-dom';
import axios from 'axios';

import useToken from './useToken';
import LoginPage from "../pages/LoginPage";


const AuthContext = createContext();

function AuthProvider({ children }) {
    const { token, setToken, removeToken } = useToken();

    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    async function signIn(email, password) {
        return new Promise((resolve, reject) => {
            axios.post(`/login`, {
                email: email,
                password: password
            }).then(res => {
                setToken(res.data.token);
                resolve({
                    status: res.status,
                    statusText: res.statusText
                });
            }).catch(err => {
                if (err.response) {
                    resolve({
                        status: err.response.status,
                        statusText: err.response.statusText
                    });
                } else {
                    reject(err);
                }
            })
        });
    }

    function signOut() {
        removeToken();
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

function ProtectedRoutes() {
    const { token, setToken } = useToken();

    if (token) {
        return <Outlet />;
    } else {
        return <LoginPage />
    }
};


export {
    AuthProvider,
    ProtectedRoutes
}

export default AuthContext;
