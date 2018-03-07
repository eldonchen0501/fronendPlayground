import {
  GET_CUISINE_TYPE_LIST,
  GET_CUISINE_TYPE_TOTAL_COUNT,
  UPDATE_CUISINE_TYPE,
  DELETE_CUISINE_TYPE,
  CREATE_CUISINE_TYPE,
} from '../constants/CuisineTypeConstants';

export default {
  // get count
  getCuisineTypeTotalCountRequest: () => ({
    type: GET_CUISINE_TYPE_TOTAL_COUNT.REQUEST,
  }),

  getCuisineTypeTotalCountSuccess: rawData => ({
    type: GET_CUISINE_TYPE_TOTAL_COUNT.SUCCESS,
    payload: rawData,
  }),

  getCuisineTypeTotalCountFailure: err => ({
    type: GET_CUISINE_TYPE_TOTAL_COUNT.FAILURE,
    err,
  }),

  // update cuisine-type
  updateCuisineTypeRequest: () => ({
    type: UPDATE_CUISINE_TYPE.REQUEST,
  }),

  updateCuisineTypeSuccess: rawdata => ({
    type: UPDATE_CUISINE_TYPE.SUCCESS,
    payload: rawdata,
  }),

  updateCuisineTypeFailure: err => ({
    type: UPDATE_CUISINE_TYPE.FAILURE,
    payload: err,
  }),

  // delete cuisine-type
  deleteCuisineTypeRequest: () => ({
    type: DELETE_CUISINE_TYPE.REQUEST,
  }),

  deleteCuisineTypeSuccess: rawdata => ({
    type: DELETE_CUISINE_TYPE.SUCCESS,
    payload: rawdata,
  }),

  deleteCuisineTypeFailure: err => ({
    type: DELETE_CUISINE_TYPE.FAILURE,
    payload: err,
  }),

  // create cuisine-type
  createCuisineTypeRequest: () => ({
    type: CREATE_CUISINE_TYPE.REQUEST,
  }),

  createCuisineTypeSuccess: rawdata => ({
    type: CREATE_CUISINE_TYPE.SUCCESS,
    payload: rawdata,
  }),

  createCuisineTypeFailure: err => ({
    type: CREATE_CUISINE_TYPE.FAILURE,
    payload: err,
  }),

  // get list
  getCuisineTypeListRequest: () => ({
    type: GET_CUISINE_TYPE_LIST.REQUEST,
  }),
  
  getCuisineTypeListSuccess: rawdata => ({
    type: GET_CUISINE_TYPE_LIST.SUCCESS,
    payload: rawdata,
  }),
  
  getCuisineTypeListFailure: err => ({
    type: GET_CUISINE_TYPE_LIST.FAILURE,
    payload: err,
  }),
};
