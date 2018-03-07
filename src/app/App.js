import Backbone from 'backbone';
import moment from 'moment';
import Router from './Router';
import config from './config';
import localStorage from './localStorage';
import configureStore from './configureStore';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_TTL,
  ACCESS_TOKEN_CREATED,
  USER_ID,
} from '../constants/LocalStorageKeys';

const store = configureStore();

class App {
  start() {
    this.initializeStore();
    this.initializeRouter(); // we will continue the rest of bootstrapping steps in the router
  }

  initializeStore() {
    this.store = configureStore();
  }

  initializeRouter() {
    // initiate a new router which will render the RootContainer into DOM
    this.router = new Router({
      app: this,
      store,
    });
    Backbone.history.start();
  }

  /**
   * return app's config object
   * other modules shouldn't import config directly; they should call app.getConfig() instead.
   * this is for better module decoupling
   */
  getConfig() {
    return config;
  }

  /**
   * Check localStorage to see if token is there.
   * If token exists and it's not expired, this function will return true.
   */
  isAuthenticated() {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const tokenCreated = localStorage.getItem(ACCESS_TOKEN_CREATED);
    const tokenTtl = localStorage.getItem(ACCESS_TOKEN_TTL);
    const tokenExpTime = parseInt(moment(tokenCreated).format('x'), 10) + (tokenTtl * 1000);

    return token !== null && moment().isBefore(tokenExpTime);
  }

  /**
   * login here means store access token and other auth data to localStorage.
   * IT IS NOT about calling API endpoints.
   *
   * This function is called only when user logged in successfully to store data into localStorage,
   * NOT every time user starts the app.
   */
  login(accessToken, ttl, created, userId) {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(ACCESS_TOKEN_TTL, ttl);
    localStorage.setItem(ACCESS_TOKEN_CREATED, created);
    localStorage.setItem(USER_ID, userId);
  }

  /**
   * clean up the authentication data in the localStorage
   */
  logout() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(ACCESS_TOKEN_TTL);
    localStorage.removeItem(ACCESS_TOKEN_CREATED);
    localStorage.removeItem(USER_ID);
  }
}

export default App;
