import { useState } from 'react';
import axios from 'axios';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    // Token axios hinzufügen für anfragen
    axios.defaults.headers.common = { 'Authorization': `Bearer ${userToken.token}` };

    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token
  }
}
