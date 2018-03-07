import _ from 'lodash';
import { handleActions } from 'redux-actions';
import {
  GET_RESTAURANT_TOTAL_COUNT,
  GET_RESTAURANT_LIST,
  UPDATE_RESTAURANT_LIST,
  GET_RESTAURANT_DETAIL,
  CREATE_RESTAURANT,
  UPDATE_RESTAURANT,
  DELETE_RESTAURANT,
} from '../constants/RestaurantConstants';

const initialState = {
  // states to check if there are active requests at the moment
  isRequestingTotalCount: false,
  isRequestingList: false,
  isRequestingDetail: false,
  isCreating: false,
  isUpdating: false,
  isUpdateingList: false,
  isDeleting: false,
  // actual data
  totalCount: 0,
  // this should be used as pagination data, which will be partially loaded until client needs more
  // however, in the MVP, we'll just take all data at once.
  restaurantList: [],
  restaurantDetails: {}, // key: restaurant id, value: data
};

export default handleActions({
  // total count
  [GET_RESTAURANT_TOTAL_COUNT.REQUEST]: state => ({
    ...state,
    isRequestingTotalCount: true,
  }),

  [GET_RESTAURANT_TOTAL_COUNT.SUCCESS]: (state, action) => ({
    ...state,
    totalCount: action.payload.count,
    isRequestingTotalCount: false,
  }),

  [GET_RESTAURANT_TOTAL_COUNT.FAILURE]: state => ({
    ...state,
    isRequestingTotalCount: false,
  }),

  // get list
  [GET_RESTAURANT_LIST.REQUEST]: state => ({
    ...state,
    isLoadingList: true,
  }),

  [GET_RESTAURANT_LIST.SUCCESS]: (state, action) => ({
    ...state,
    isLoadingList: false,
    restaurantList: action.payload,
  }),

  [GET_RESTAURANT_LIST.FAILURE]: state => ({
    ...state,
    isLoadingList: false,
  }),

  // update data of a single restaurant in the list
  
  [UPDATE_RESTAURANT_LIST.REQUEST]: state => ({
    ...state,
    isUpdateingList: true,
  }),
  
  [UPDATE_RESTAURANT_LIST.SUCCESS]: (state, action) => {
    const nextState = { ...state };
    const updateRestaurant = action.payload;
    const idx = _.findIndex(nextState.restaurantList, { id: updateRestaurant.id });
    nextState.restaurantList.splice(idx, 1, updateRestaurant);
    nextState.isUpdateingList = false;
    return nextState;
  },
  
  [UPDATE_RESTAURANT_LIST.FAILURE]: state => ({
    ...state,
    isUpdateingList: false,
  }),
  
  // get details
  [GET_RESTAURANT_DETAIL.REQUEST]: state => ({
    ...state,
    isRequestingDetail: true,
  }),

  [GET_RESTAURANT_DETAIL.SUCCESS]: (state, action) => {
    const nextState = state;
    nextState.restaurantDetails[action.payload.id] = action.payload;
    nextState.isRequestingDetail = false;
    return {
      ...state,
      ...nextState,
    };
  },

  [GET_RESTAURANT_DETAIL.FAILURE]: state => ({
    ...state,
    isRequestingDetail: false,
  }),

  // UPDATE
  // ------

  [UPDATE_RESTAURANT.REQUEST]: state => ({
    ...state,
    isUpdating: true,
  }),

  [UPDATE_RESTAURANT.SUCCESS]: (state, action) => {
    const nextState = state;
    nextState.restaurantDetails[action.payload.id] = {
      ...nextState.restaurantDetails[action.payload.id],
      ...action.payload,
    };
    const returnState = {
      ...state,
      ...nextState,
      isUpdating: false,
    };
    return returnState;
  },

  [UPDATE_RESTAURANT.FAILURE]: state => ({
    ...state,
    isUpdating: false,
  }),
  
  // create
  [CREATE_RESTAURANT.REQUEST]: state => ({
    ...state,
    isCreating: true,
  }),
  
  [CREATE_RESTAURANT.SUCCESS]: (state, action) => {
    const newRestaurantList = state.restaurantList.slice();
    newRestaurantList.push(action.payload);
    return {
      ...state,
      restaurantList: newRestaurantList,
      isCreating: false,
    };
  },

  [CREATE_RESTAURANT.FAILURE]: state => ({
    ...state,
    isCreating: false,
  }),
  
  // delete
  [DELETE_RESTAURANT.REQUEST]: state => ({
    ...state,
    isDeleting: true,
  }),

  [DELETE_RESTAURANT.SUCCESS]: (state, action) => {
    const restaurantId = action.payload.id;
    const deletedIndex = _.findIndex(state.restaurantList, { id: restaurantId });
    const nextState = state;

    nextState.restaurantList.splice(deletedIndex, 1);
    try {
      delete nextState.restaurantDetail[restaurantId];
    } catch (e) {
      // do nothing
    }

    return {
      ...state,
      ...nextState,
      isDeleting: false,
    };
  },

  [DELETE_RESTAURANT.FAILURE]: state => ({
    ...state,
    isDeleting: false,
  }),
}, initialState);
