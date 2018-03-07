import {
  DELETE_REPORT,
  GET_REPORT_LIST,
  GET_REPORT_TOTAL_COUNT,
} from '../constants/ReportConsts';

export default {
  // get count
  getReportTotalCountRequest: () => ({
    type: GET_REPORT_TOTAL_COUNT.REQUEST,
  }),

  getReportTotalCountSuccess: rawData => ({
    type: GET_REPORT_TOTAL_COUNT.SUCCESS,
    payload: rawData,
  }),

  getReportTotalCountFailure: err => ({
    type: GET_REPORT_TOTAL_COUNT.FAILURE,
    err,
  }),
  
  // get list
  getReportListRequest: () => ({
    type: GET_REPORT_LIST.REQUEST,
  }),

  getReportListSuccess: rawData => ({
    type: GET_REPORT_LIST.SUCCESS,
    payload: rawData,
  }),

  getReportListFailure: err => ({
    type: GET_REPORT_LIST.FAILURE,
    payload: err,
  }),

  // delete report
  deleteReportRequest: () => ({
    type: DELETE_REPORT.REQUEST,
  }),

  deleteReportSuccess: rawData => ({
    type: DELETE_REPORT.SUCCESS,
    payload: rawData,
  }),

  deleteReportFailure: err => ({
    type: DELETE_REPORT.FAILURE,
    payload: err,
  }),
};
