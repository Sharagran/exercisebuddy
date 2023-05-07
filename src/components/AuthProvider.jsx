import React, { createContext } from "react";
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import useToken from './useToken';
import LoginPage from "../pages/LoginPage";


const AuthContext = createContext();

function AuthProvider({ children }) {
    const { token, setToken, removeToken } = useToken();

    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    axios.interceptors.response.use(
        response => response,
        error => {
            // epected error: wrong login
            if(error.response.status === 401 && !token) {
                console.log("Wrong username or password.");
                return Promise.reject(error);
            }


            // unexpected errors
            if (error.response.status === 400) {
                toast.error('Bad request.');
            } else if (error.response.status === 401 && token) {
                toast.error('Login expired, please log in again.');
    
                setTimeout(() => {
                    signOut();
                    window.location.reload();
                }, 3000);
            } else if (error.response.status === 403) {
                toast.error('You do not have permission to access this resource.');
            } else if (error.response.status === 404) {
                toast.error('Resource not found.');
            } else if (error.response.status === 500) {
                toast.error('Internal server error.');
            } else {
                toast.error('An error occurred.');
            }
    
            console.error(error);
            return Promise.reject(error);
        }
    );

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

    function forgotPassword(email) {
        return new Promise((resolve, reject) => {
            axios.post(`/passwords/forgot`, {
                email: email
            }).then(res => {
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

    function resetPassword(token, password) {
        return new Promise((resolve, reject) => {
            axios.post(`/passwords/change`, {
                token: token,
                password: password
            }).then(res => {
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


    const contextValue = {
        token,
        signIn,
        signOut,

        forgotPassword,
        resetPassword
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
