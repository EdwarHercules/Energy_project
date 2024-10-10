import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { authData } = useAuth();

  return (
    <Route
      {...rest}
      render={props =>
        authData.token ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
