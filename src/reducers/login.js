import { handleActions } from 'redux-actions';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
} from '../constants/ActionTypes';

const initialState = {
  isLoggingIn: false,
  isLoggingOut: false,
  accessToken: '',
  ttl: '',
  created: '',
  userId: '',
};

export default handleActions({
  [LOGIN_REQUEST]: state => ({
    ...state,
    isLoggingIn: true,
  }),
  [LOGIN_SUCCESS]: (state, action) => ({
    ...state,
    isLoggingIn: false,
    accessToken: action.payload.id,
    ttl: action.payload.ttl,
    created: action.payload.created,
    userId: action.payload.userId,
  }),
  [LOGIN_FAILURE]: state => ({
    ...state,
    isLoggingIn: false,
  }),
  [LOGOUT_REQUEST]: state => ({
    ...state,
    isLoggingOut: true,
  }),
  [LOGOUT_SUCCESS]: () => ({
    ...initialState,
  }),
  [LOGOUT_FAILURE]: state => ({
    ...state,
    isLoggingOut: true,
  }),
}, initialState);
