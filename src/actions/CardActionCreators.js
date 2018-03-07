import {
  REJECT_CARD,
  UPDATE_CARD,
  CREATE_CARD,
  DELETE_CARD,
  APPROVE_CARD,
  GET_CARD_LIST,
  UPDATE_CARD_LIST,
  GET_CARD_DETAIL,
  GET_CARD_TOTAL_COUNT,
} from '../constants/CardConstants';

export default {
  getCardTotalCountRequest: () => ({
    type: GET_CARD_TOTAL_COUNT.REQUEST,
  }),

  getCardTotalCountSuccess: rawData => ({
    type: GET_CARD_TOTAL_COUNT.SUCCESS,
    payload: rawData,
  }),

  getCardTotalCountFailure: err => ({
    type: GET_CARD_TOTAL_COUNT.FAILURE,
    err,
  }),

  getCardListRequest: () => ({
    type: GET_CARD_LIST.REQUEST,
  }),

  getCardListSuccess: rawData => ({
    type: GET_CARD_LIST.SUCCESS,
    payload: rawData,
  }),

  getCardListFailure: err => ({
    type: GET_CARD_LIST.FAILURE,
    payload: err,
  }),

  updateCardListRequest: () => ({
    type: UPDATE_CARD_LIST.REQUEST,
  }),
  
  updateCardListSuccess: rawData => ({
    type: UPDATE_CARD_LIST.SUCCESS,
    payload: rawData,
  }),
  
  updateCardListFailure: () => ({
    type: UPDATE_CARD_LIST.FAILURE,
  }),
  
  getCardDetailRequest: () => ({
    type: GET_CARD_DETAIL.REQUEST,
  }),

  getCardDetailSuccess: rawData => ({
    type: GET_CARD_DETAIL.SUCCESS,
    payload: rawData,
  }),

  getCardDetailFailure: () => ({
    type: GET_CARD_DETAIL.FAILURE,
  }),

  approveCardRequest: () => ({
    type: APPROVE_CARD.REQUEST,
  }),

  approveCardSuccess: rawData => ({
    type: APPROVE_CARD.SUCCESS,
    payload: rawData,
  }),

  approveCardFailure: err => ({
    type: APPROVE_CARD.FAILURE,
    payload: err,
  }),

  updateCardRequest: () => ({
    type: UPDATE_CARD.REQUEST,
  }),

  updateCardSuccess: rawData => ({
    type: UPDATE_CARD.SUCCESS,
    payload: rawData,
  }),

  updateCardFailure: err => ({
    type: UPDATE_CARD.FAILURE,
    payload: err,
  }),

  rejectCardRequest: () => ({
    type: REJECT_CARD.REQUEST,
  }),

  rejectCardSuccess: rawData => ({
    type: REJECT_CARD.SUCCESS,
    payload: rawData,
  }),

  rejectCardFailure: err => ({
    type: REJECT_CARD.FAILURE,
    payload: err,
  }),

  deleteCardRequest: () => ({
    type: DELETE_CARD.REQUEST,
  }),

  deleteCardSuccess: rawData => ({
    type: DELETE_CARD.SUCCESS,
    payload: rawData,
  }),

  deleteCardFailure: err => ({
    type: DELETE_CARD.FAILURE,
    payload: err,
  }),

  createCardRequest: () => ({
    type: CREATE_CARD.REQUEST,
  }),

  createCardSuccess: rawData => ({
    type: CREATE_CARD.SUCCESS,
    payload: rawData,
  }),

  createCardFailure: err => ({
    type: CREATE_CARD.FAILURE,
    payload: err,
  }),
};
