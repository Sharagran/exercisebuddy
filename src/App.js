import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, ProtectedRoutes } from './components/AuthProvider';
import { ExerciseProvider } from './components/ExerciseProvider';

import LoginPage from './pages/LoginPage';
import Overview from './pages/Overview';
import Exercise from './pages/Exercise';
import ResetPassword from './pages/ResetPassword';


function App() {
  axios.defaults.baseURL = process.env.REACT_APP_EXERCISEBUDDY_API_URL;

  return (
    <>
      <Toaster position="bottom-right" />
      <h1>Exercisebuddy</h1>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Protected Routes */}
            <Route element={<ProtectedRoutes />}>
              <Route element={<ExerciseProvider />}>
                <Route path="/" element={<Overview />} />
                <Route path="/exercise/:id" element={<Exercise />} />
              </Route>
            </Route>

            {/* Public Routes */}
            <Route>
              {/* FIXME: Dev only route */}
              <Route path="/login" element={<LoginPage />} />

              <Route path="/passwords/change/:token" element={<ResetPassword />} />
              {/* TODO: implement page not found page */}
              <Route path="*" element={<h1>404</h1>} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
