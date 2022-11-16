import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

import useToken from './components/useToken';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Exercise from './pages/Exercise';
import { ExerciseProvider } from './components/ExerciseProvider';

function App() {
  const { token, setToken } = useToken();
  const [exercises, setExercises] = useState([]);

  axios.defaults.baseURL = process.env.REACT_APP_EXERCISEBUDDY_API_URL;

  // function fetchExercises() {
  //   console.log('fetching exercises');
  //   // axios.defaults.headers.common['Authorization'] = '69bf11e1';
  //   axios.get('/exercises').then(res => {
  //     console.log(res.data); //FIXME: debug only
  //     setExercises(res.data);
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }

  function signOut() {
    setToken(null);
  }

  // useEffect(() => {
  //   if (token) fetchExercises();
  // }, []);

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
    pageContent = (
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Login setToken={setToken} />}></Route>
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <>
      <ExerciseProvider>
        <Toaster position="bottom-right" />
        <h1>Exercisebuddy</h1>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Overview />}></Route>
            <Route path="/exercise/:id" element={<Exercise />}></Route>

            {/* FIXME: Dev only routes */}
            <Route path="/login" element={<Login setToken={setToken} />}></Route>
          </Routes>
        </BrowserRouter>
      </ExerciseProvider>
    </>
  );

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
