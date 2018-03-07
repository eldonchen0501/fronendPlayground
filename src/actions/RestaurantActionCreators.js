import {
  GET_RESTAURANT_TOTAL_COUNT,
  GET_RESTAURANT_LIST,
  UPDATE_RESTAURANT_LIST,
  GET_RESTAURANT_DETAIL,
  CREATE_RESTAURANT,
  UPDATE_RESTAURANT,
  DELETE_RESTAURANT,
} from '../constants/RestaurantConstants';

export default {
  getRestaurantTotalCountRequest: () => ({
    type: GET_RESTAURANT_TOTAL_COUNT.REQUEST,
  }),

  getRestaurantTotalCountSuccess: rawData => ({
    type: GET_RESTAURANT_TOTAL_COUNT.SUCCESS,
    payload: rawData,
  }),

  getRestaurantTotalCountFailure: err => ({
    type: GET_RESTAURANT_TOTAL_COUNT.FAILURE,
    err,
  }),

  getRestaurantListRequest: () => ({
    type: GET_RESTAURANT_LIST.REQUEST,
  }),

  getRestaurantListSuccess: rawData => ({
    type: GET_RESTAURANT_LIST.SUCCESS,
    payload: rawData,
  }),

  getRestaurantListFailure: () => ({
    type: GET_RESTAURANT_LIST.FAILURE,
  }),
  
  updateRestaurantListRequest: () => ({
    type: UPDATE_RESTAURANT_LIST.REQUEST,
  }),

  updateRestaurantListSuccess: rawData => ({
    type: UPDATE_RESTAURANT_LIST.SUCCESS,
    payload: rawData,
  }),
  
  updateRestaurantListFailure: () => ({
    type: UPDATE_RESTAURANT_LIST.FAILURE,
  }),
  
  getRestaurantDetailRequest: () => ({
    type: GET_RESTAURANT_DETAIL.REQUEST,
  }),

  getRestaurantDetailSuccess: rawData => ({
    type: GET_RESTAURANT_DETAIL.SUCCESS,
    payload: rawData,
  }),

  getRestaurantDetailFailure: err => ({
    type: GET_RESTAURANT_DETAIL.FAILURE,
    err,
  }),

  createRestaurantRequest: () => ({
    type: CREATE_RESTAURANT.REQUEST,
  }),

  createRestaurantSuccess: rawData => ({
    type: CREATE_RESTAURANT.SUCCESS,
    payload: rawData,
  }),

  createRestaurantFailure: err => ({
    type: CREATE_RESTAURANT.FAILURE,
    err,
  }),

  updateRestaurantRequest: () => ({
    type: UPDATE_RESTAURANT.REQUEST,
  }),

  updateRestaurantSuccess: rawData => ({
    type: UPDATE_RESTAURANT.SUCCESS,
    payload: rawData,
  }),

  updateRestaurantFailure: err => ({
    type: UPDATE_RESTAURANT.FAILURE,
    err,
  }),

  deleteRestaurantRequest: () => ({
    type: DELETE_RESTAURANT.REQUEST,
  }),

  deleteRestaurantSuccess: id => ({
    type: DELETE_RESTAURANT.SUCCESS,
    payload: { id },
  }),

  deleteRestaurantFailure: err => ({
    type: DELETE_RESTAURANT.FAILURE,
    err,
  }),
};
