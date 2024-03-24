import React, { createContext, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = (email, password) => {
    setIsLoading(true);
    setError(null); // Clear any previous errors

    axios
      .post(`${BASE_URL}/login`, {
        email,
        password,
      })
      .then((res) => {
        let user = res.data;
        setUserInfo(user);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 422)) {
          // Handle wrong credentials here
          setError('Wrong credentials');
          console.log('Wrong credentials');
        } else {
          console.log(`login error: ${error}`);
        }
        setIsLoading(false);
      });
  };

  const logout = () => {
    setIsLoading(true);

    axios
      .post(`${BASE_URL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })
      .then((res) => {
        setUserInfo(null);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(`logout error ${e}`);
        setIsLoading(false);
      });
  };

  return (
    <AuthContext.Provider value={{ isLoading, userInfo, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};