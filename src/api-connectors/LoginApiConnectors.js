/**
 * make a post request to authentication API to get access tokens and other credentials
 */
import ajax from '../libs/ajax';
import config from '../app/config';

const { apiUrl } = config;

export default {
  login: (email, password) => ajax('POST', `${apiUrl}/admin-users/login`, {
    email,
    password,
  }, {
    noAuth: true,
  }),

  logout: () => ajax('POST', `${apiUrl}/admin-users/logout`, {}),
};
