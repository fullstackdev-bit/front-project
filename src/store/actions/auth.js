import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
} from './types';

import { sendRequest } from '../../config/compose';

export const register =
  (username, password, first_name, last_name) => async (dispatch) => {
    try {
      const result = await sendRequest('auth/register', 'POST', {
        username,
        password,
        first_name,
        last_name,
      });

      dispatch({ type: REGISTER_SUCCESS });
      dispatch({ type: SET_MESSAGE, payload: result.message });
    } catch (error) {
      throw error;
    } /*
    return AuthService.register(username, password, firstname, lastname).then(
      (response) => {
        dispatch({
          type: REGISTER_SUCCESS,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: response.data.message,
        });

        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        dispatch({
          type: REGISTER_FAIL,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

        return Promise.reject();
      }
    );*/
  };

export const loadMe = () => (dispatch) => {
  const token = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');
  if (!token) {
    dispatch({ type: LOGOUT });
  } else {
    dispatch({ type: LOGIN_SUCCESS, payload: JSON.parse(user) });
  }
};

export const login = (username, password) => async (dispatch) => {
  try {
    const result = await sendRequest('auth/login', 'POST', {
      username,
      password,
    });

    localStorage.setItem('access_token', result.access_token);
    localStorage.setItem('user', JSON.stringify(result.user));

    dispatch({ type: LOGIN_SUCCESS, payload: result.user });
  } catch (error) {
    throw error;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');

  dispatch({ type: LOGOUT });
};
