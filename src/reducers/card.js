import _ from 'lodash';
import { handleActions } from 'redux-actions';
import {
  CARD_STATUS,
  CREATE_CARD,
  DELETE_CARD,
  REJECT_CARD,
  UPDATE_CARD,
  APPROVE_CARD,
  GET_CARD_LIST,
  UPDATE_CARD_LIST,
  GET_CARD_DETAIL,
  GET_CARD_TOTAL_COUNT,
} from '../constants/CardConstants';

const initialState = {
  // states to check if there are active requests at the moment
  isRequestingTotalCount: false,
  isRequestingDetail: false,
  isRequestingList: false,
  isApprovingCard: false,
  isRejectingCard: false,
  isDeletingCard: false,
  isUpdating: false,
  isUpdatingList: false,
  // actual data
  totalCount: 0,
  // data storage
  cardList: [],
  cardDetails: {},
};

export default handleActions({
  // total count
  [GET_CARD_TOTAL_COUNT.REQUEST]: state => ({
    ...state,
    isRequestingTotalCount: true,
  }),

  [GET_CARD_TOTAL_COUNT.SUCCESS]: (state, action) => ({
    ...state,
    totalCount: action.payload.count,
    isRequestingTotalCount: false,
  }),

  [GET_CARD_TOTAL_COUNT.FAILURE]: state => ({
    ...state,
    isRequestingTotalCount: false,
  }),

  // get list
  [GET_CARD_LIST.REQUEST]: state => ({
    ...state,
    isRequestingList: true,
  }),

  [GET_CARD_LIST.SUCCESS]: (state, action) => ({
    ...state,
    isRequestingList: false,
    cardList: action.payload,
  }),

  [GET_CARD_LIST.FAILURE]: state => ({
    ...state,
    isRequestingList: false,
  }),

  // update a single card on the list
  [UPDATE_CARD_LIST.REQUEST]: state => ({
    ...state,
    isUpdateingList: true,
  }),
  
  [UPDATE_CARD_LIST.SUCCESS]: (state, action) => {
    const nextState = { ...state };
    const updateCard = action.payload;
    const idx = _.findIndex(nextState.cardList, { id: updateCard.id });
    nextState.cardList.splice(idx, 1, updateCard);
    nextState.isUpdateingList = false;
    return nextState;
  },
  
  [UPDATE_CARD_LIST.FAILURE]: state => ({
    ...state,
    isUpdateingList: false,
  }),
  
  // approve card
  [APPROVE_CARD.REQUEST]: state => ({
    ...state,
    isApprovingCard: true,
  }),

  [APPROVE_CARD.SUCCESS]: (state, action) => {
    const card = action.payload.data;
    const index = _.findIndex(state.cardList, { id: card.id });

    const newState = ({
      ...state,
      isApprovingCard: false,
    });

    if (index > -1) {
      newState.cardList[index].status = CARD_STATUS.APPROVED;
    }

    return newState;
  },

  [APPROVE_CARD.FAILURE]: state => ({
    ...state,
    isApprovingCard: false,
  }),

  // delete card
  [DELETE_CARD.REQUEST]: state => ({
    ...state,
    isDeletingCard: true,
  }),

  [DELETE_CARD.SUCCESS]: (state, action) => {
    const card = action.payload.data;
    const index = _.findIndex(state.cardList, { id: card.id });

    const newState = ({
      ...state,
      isDeletingCard: false,
    });

    if (index > -1) {
      newState.cardList[index].status = CARD_STATUS.DELETED;
    }

    return newState;
  },

  [DELETE_CARD.FAILURE]: state => ({
    ...state,
    isDeletingCard: false,
  }),

  // reject card
  [REJECT_CARD.REQUEST]: state => ({
    ...state,
    isRejectingCard: true,
  }),

  [REJECT_CARD.SUCCESS]: (state, action) => {
    const card = action.payload.data;
    const index = _.findIndex(state.cardList, { id: card.id });

    const newState = ({
      ...state,
      isRejectingCard: false,
    });

    if (index > -1) {
      newState.cardList[index].status = CARD_STATUS.REJECTED;
    }

    return newState;
  },

  [REJECT_CARD.FAILURE]: state => ({
    ...state,
    isRejectingCard: false,
  }),

  // get details
  [GET_CARD_DETAIL.REQUEST]: state => ({
    ...state,
    isRequestingDetail: true,
  }),

  [GET_CARD_DETAIL.SUCCESS]: (state, action) => ({
    ...state,
    isRequestingDetail: false,
    cardDetails: action.payload,
  }),

  [GET_CARD_DETAIL.FAILURE]: state => ({
    ...state,
    isRequestingDetail: false,
  }),

  // UPDATE
  // ------

  [UPDATE_CARD.REQUEST]: state => ({
    ...state,
    isUpdating: true,
  }),

  [UPDATE_CARD.SUCCESS]: (state, action) => {
    const nextState = { ...state };
    nextState.cardDetails = action.payload;
    nextState.isUpdating = false;
    return nextState;
  },

  [UPDATE_CARD.FAILURE]: state => ({
    ...state,
    isUpdating: false,
  }),

  [CREATE_CARD.REQUEST]: state => ({
    ...state,
    isUpdating: true,
  }),

  [CREATE_CARD.SUCCESS]: (state, action) => {
    const nextState = { ...state };
    nextState.cardDetails = action.payload;
    nextState.isUpdating = false;
    return nextState;
  },

  [CREATE_CARD.FAILURE]: state => ({
    ...state,
    isUpdating: false,
  }),
}, initialState);
