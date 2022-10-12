import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import useToken from './components/useToken';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Exercise from './components/Exercise';

function App() {
  const { token, setToken } = useToken();

  if(token) {
    axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` };
  } else {
    return <Login setToken={setToken} />
  }


  return (
    <>
      <BrowserRouter>
        <h1>Exercisebuddy</h1>
        <Routes>
          <Route exact path="/" element={<Overview />}></Route>
          <Route path="/exercise/:id" element={<Exercise />}></Route>

          {/* FIXME: Dev only routes */}
          <Route path="/login" element={<Login setToken={setToken} />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
