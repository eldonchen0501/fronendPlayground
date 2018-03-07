/**
 * the ajax function this app uses to make any web API calls.
 *
 * @example:
 *    ajax('GET', 'https://awesome.api/users');
 *    ajax('POST, 'https://cool.api/users/1', {
 *      firstName: 'Foo'
 *      lastName: 'Bar'
 *    });
 */
import $ from 'jquery';
import _ from 'lodash';
import Promise from 'bluebird';
import app from '../app';
import localStorage from '../app/localStorage';
import { ACCESS_TOKEN } from '../constants/LocalStorageKeys';

const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];

/**
 * @param {string} method - 'GET', 'POST', 'PUT', 'DELETE'
 * @param {string} url
 * @param {object} [data] for POST or PUT. will call JSON.stringify before use as request body
 * @return {Promise} - resolve with response JSON object from API or Error object
 */
export default function ajax(method, url, data, options = {}) {
  if (validMethods.indexOf(method) === -1) {
    throw new Error(`Invalid ajax request method: [${method}]`);
  }
  return new Promise((resolve, reject) => {
    let ajaxOptions = {
      url,
      method,
      beforeSend: (request, settings) => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (accessToken !== null && !options.noAuth) {
          // check if url already has other params
          const leadChar = settings.url.indexOf('?') === -1 ? '?' : '&';
          settings.url += `${leadChar}access_token=${accessToken}`; // eslint-disable-line
        }
      },
      cache: false,
      contentType: 'application/json',
      dataType: 'json',
      success: response => resolve(response),
      error: (err) => {
        // handling unauthorized case, most likely an expired token
        if (err.status === 401) {
          // stay at current page for a little longer to make UX better
          setTimeout(() => {
            app.router.navigate('logout', { trigger: true });
          }, 1000);
          return reject(new Error('Your session has expired. Please log in again.'));
        }
        return reject(new Error(err.responseJSON.message));
      },
    };

    if (data) {
      ajaxOptions.data = JSON.stringify(data);
    }
  
    // merge and overwrite default options if provided in additional Options
    ajaxOptions = _.merge(ajaxOptions, options);

    $.ajax(ajaxOptions);
  });
}
