import _ from 'lodash';
import { handleActions } from 'redux-actions';
import {
  DELETE_REPORT,
  GET_REPORT_LIST,
  GET_REPORT_TOTAL_COUNT,
} from '../constants/ReportConsts';

const initialState = {
  // states to check if there are active requests at the moment
  isRequestingTotalCount: false,
  isRequestingList: false,
  isDeletingReport: false,
  // actual data
  totalCount: 0,
  // this should be used as pagination data, which will be partially loaded until client needs more
  // however, in the MVP, we'll just take all data at once.
  // report storage
  reportList: [],
};

export default handleActions({
  // total count
  [GET_REPORT_TOTAL_COUNT.REQUEST]: state => ({
    ...state,
    isRequestingTotalCount: true,
  }),

  [GET_REPORT_TOTAL_COUNT.SUCCESS]: (state, action) => ({
    ...state,
    totalCount: action.payload.count,
    isRequestingTotalCount: false,
  }),

  [GET_REPORT_TOTAL_COUNT.FAILURE]: state => ({
    ...state,
    isRequestingTotalCount: false,
  }),
  
  // get list
  [GET_REPORT_LIST.REQUEST]: state => ({
    ...state,
    isRequestingList: true,
  }),

  [GET_REPORT_LIST.SUCCESS]: (state, action) => ({
    ...state,
    isRequestingList: false,
    reportList: action.payload,
  }),

  [GET_REPORT_LIST.FAILURE]: state => ({
    ...state,
    isRequestingList: false,
  }),

  // delete report
  [DELETE_REPORT.REQUEST]: state => ({
    ...state,
    isDeletingReport: true,
  }),

  [DELETE_REPORT.SUCCESS]: (state, action) => {
    const report = action.payload.data;
    const index = _.findIndex(state.reportList, { id: report.id });

    const newState = ({
      ...state,
      isDeletingReport: false,
    });

    if (index > -1) {
      newState.reportList.splice(index, 1);
    }

    return newState;
  },

  [DELETE_REPORT.FAILURE]: state => ({
    ...state,
    isDeletingReport: true,
  }),

}, initialState);
