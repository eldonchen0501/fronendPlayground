import ajax from '../libs/ajax';
import config from '../app/config';

const { apiUrl } = config;

export default {
  getTotalReportCount: () => ajax('GET', `${apiUrl}/reports/count`),

  getPendingReportList: () => ajax('GET', `${apiUrl}/reports?filter[where][status]=PENDING`),

  deleteReport: id => ajax('POST', `${apiUrl}/reports/${id}/delete`),
};
