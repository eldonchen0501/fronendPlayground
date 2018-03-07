import _ from 'lodash';
import { handleActions } from 'redux-actions';
import {
  GET_CUISINE_TYPE_LIST,
  GET_CUISINE_TYPE_TOTAL_COUNT,
  UPDATE_CUISINE_TYPE,
  DELETE_CUISINE_TYPE,
  CREATE_CUISINE_TYPE,
} from '../constants/CuisineTypeConstants';

const initialState = {
  // states to check if there are active requests at the moment
  isRequestingTotalCount: false,
  isRequestingList: false,
  isUpdating: false,
  isCreating: false,
  isDeleting: false,
  // actual data
  totalCount: 0,
  // this should be used as pagination data, which will be partially loaded until client needs more
  // however, in the MVP, we'll just take all data at once.
  // cuisine-type storage
  cuisineTypeList: [],
};

export default handleActions({
  // total count
  [GET_CUISINE_TYPE_TOTAL_COUNT.REQUEST]: state => ({
    ...state,
    isRequestingTotalCount: true,
  }),

  [GET_CUISINE_TYPE_TOTAL_COUNT.SUCCESS]: (state, action) => ({
    ...state,
    totalCount: action.payload.count,
    isRequestingTotalCount: false,
  }),

  [GET_CUISINE_TYPE_TOTAL_COUNT.FAILURE]: state => ({
    ...state,
    isRequestingTotalCount: false,
  }),

  // get list
  [GET_CUISINE_TYPE_LIST.REQUEST]: state => ({
    ...state,
    isRequestingList: true,
  }),
  
  [GET_CUISINE_TYPE_LIST.SUCCESS]: (state, action) => ({
    ...state,
    isRequestingList: false,
    cuisineTypeList: action.payload,
  }),
  
  [GET_CUISINE_TYPE_LIST.FAILURE]: state => ({
    ...state,
    isRequestingList: false,
  }),

  // update cuisine-type
  [UPDATE_CUISINE_TYPE.REQUEST]: state => ({
    ...state,
    isUpdating: true,
  }),

  [UPDATE_CUISINE_TYPE.SUCCESS]: (state, action) => {
    const newCuisineType = action.payload;

    const index = _.findIndex(state.cuisineTypeList, { id: newCuisineType.id });
    const newState = {
      ...state,
      isUpdating: false,
    };

    if (index > -1) {
      newState.cuisineTypeList[index].name = newCuisineType.name;
    }
    return newState;
  },

  [UPDATE_CUISINE_TYPE.FAILURE]: state => ({
    ...state,
    isUpdating: false,
  }),

  // create cuisine-type
  [CREATE_CUISINE_TYPE.REQUEST]: state => ({
    ...state,
    isCreating: true,
  }),

  [CREATE_CUISINE_TYPE.SUCCESS]: (state, action) => {
    const newCuisineType = action.payload;
    const newState = {
      ...state,
      isCreating: false,
    };

    if (newState) {
      newState.cuisineTypeList.push(newCuisineType);
    }
    return newState;
  },

  [CREATE_CUISINE_TYPE.FAILURE]: state => ({
    ...state,
    isCreating: false,
  }),

  // delete cuisine-type
  [DELETE_CUISINE_TYPE.REQUEST]: state => ({
    ...state,
    isDeleting: true,
  }),

  [DELETE_CUISINE_TYPE.SUCCESS]: (state, action) => {
    const id = action.payload;
    const deleteIndex = _.findIndex(state.cuisineTypeList, { id });
    const newState = {
      ...state,
      isDeleting: false,
    };

    if (deleteIndex > -1) {
      newState.cuisineTypeList.splice(deleteIndex, 1);
    }
    return newState;
  },

  [DELETE_CUISINE_TYPE.FAILURE]: state => ({
    ...state,
    isDeleting: false,
  }),
}, initialState);

