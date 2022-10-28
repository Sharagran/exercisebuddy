import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

import useToken from './components/useToken';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Exercise from './components/Exercise';
import { useEffect, useState } from 'react';

function App() {
  const { token, setToken } = useToken();
  const [exercises, setExercises] = useState([]);

  function fetchExercises() {
    console.log('fetching exercises');
    // axios.defaults.headers.common['Authorization'] = '69bf11e1';
    axios.get('http://localhost:3000/exercises').then(res => {
      console.log(res.data);
      setExercises(res.data);
    });
  }

  useEffect(() => {
    fetchExercises();
  }, [])
  

  var pageContent;
  if (token) {
    axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` };
    pageContent = (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Overview exercises={exercises} />}></Route>
          <Route path="/exercise/:id" element={<Exercise exercises={exercises} />}></Route>

          {/* FIXME: Dev only routes */}
          <Route path="/login" element={<Login setToken={setToken} />}></Route>
        </Routes>
      </BrowserRouter>
    );
  } else {
    pageContent = <Login setToken={setToken} />
  }

  return (
    <>
    {/* TODO: add loading to prevent access to /exercise/:id before exercises are loaded */}
      <Toaster position="bottom-right" />
      <h1>Exercisebuddy</h1>
      {pageContent}
    </>
  );
}

export default App;
