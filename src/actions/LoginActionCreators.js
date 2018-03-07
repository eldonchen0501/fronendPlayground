import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
} from '../constants/ActionTypes';

export default {
  loginRequest: () => ({
    type: LOGIN_REQUEST,
  }),

  loginSuccess: rawData => ({
    type: LOGIN_SUCCESS,
    payload: rawData,
  }),

  loginFailure: err => ({
    type: LOGIN_FAILURE,
    err,
  }),

  logoutRequest: () => ({
    type: LOGOUT_REQUEST,
  }),

  logoutSuccess: () => ({
    type: LOGOUT_SUCCESS,
  }),

  logoutFailure: err => ({
    type: LOGOUT_FAILURE,
    err,
  }),
};
