import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

import useToken from './components/useToken';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Exercise from './components/Exercise';

function App() {
  const { token, setToken } = useToken();

  var pageContent;
  if (token) {
    axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` };
    pageContent = (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Overview />}></Route>
          <Route path="/exercise/:id" element={<Exercise />}></Route>

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
      <Toaster position="bottom-right" />
      <h1>Exercisebuddy</h1>
      {pageContent}
    </>
  );
}

export default App;
