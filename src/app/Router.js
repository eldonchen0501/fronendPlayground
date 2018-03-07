import Backbone from 'backbone';
import renderToDom from './renderToDom';
// login
import LoginContainer from '../components/login/LoginContainer';
import LogoutContainer from '../components/login/LogoutContainer';
// restaurant
import RestaurantListContainer from '../components/restaurant/RestaurantListContainer';
import RestaurantDetailContainer from '../components/restaurant/RestaurantDetailContainer';
import RestaurantCreateContainer from '../components/restaurant/RestaurantCreateContainer';
// cuisine-type
import CuisineTypeListContainer from '../components/cuisine-type/CuisineTypeListContainer';
// report
import ReportListContainer from '../components/report/ReportListContainer';
// card
import CardListContainer from '../components/card/CardListContainer';
import CardCreateContainer from '../components/card/CardCreateContainer';
import CardDetailContainer from '../components/card/CardContainer';

const Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    login: 'login',
    logout: 'logout',
    'restaurants(/)': 'restaurantList',
    'restaurants/create': 'restaurantCreate',
    'restaurants/:id': 'restaurantDetail',
    'cards(/)': 'cardList',
    'cards/create(/)': 'cardCreator',
    'cards/:id': 'cardDetail',
    'cuisine-types(/)': 'cuisineTypesList',
    'reports(/)': 'reportList',
    '*notFound': 'notFound',
  },

  initialize: function initialize(options) {
    this.app = options.app;
    this.store = options.store;
  },

  execute: function execute(callback, args) {
    if (!this.app.isAuthenticated()) {
      this.navigate('/login'); // for some unknown reasons add {trigger: true} doesn't work
      this.login(); // therefore we need to call login manually here
      return false;
    }

    if (callback) {
      return callback.apply(this, args);
    }

    return false;
  },

  index: function index() {
    renderToDom(RestaurantListContainer, this.app, this.store, {});
  },

  login: function login() {
    if (this.app.isAuthenticated()) {
      this.navigate('/');
      this.index();
    }

    renderToDom(LoginContainer, this.app, this.store, {});
  },

  restaurantDetail: function restaurantDetail(id) {
    renderToDom(RestaurantDetailContainer, this.app, this.store, { id });
  },

  restaurantList: function restaurantList() {
    renderToDom(RestaurantListContainer, this.app, this.store, {});
  },

  restaurantCreate: function restaurantCreate() {
    renderToDom(RestaurantCreateContainer, this.app, this.store, {});
  },

  cuisineTypesList: function cuisineTypeList() {
    renderToDom(CuisineTypeListContainer, this.app, this.store, {});
  },

  cardList: function cardList() {
    renderToDom(CardListContainer, this.app, this.store, {});
  },

  cardDetail: function cardDetail(id) {
    renderToDom(CardDetailContainer, this.app, this.store, { id });
  },

  cardCreator: function cardCreator() {
    renderToDom(CardCreateContainer, this.app, this.store, {});
  },

  reportList: function reportList() {
    renderToDom(ReportListContainer, this.app, this.store, {});
  },

  logout: function logout() {
    renderToDom(LogoutContainer, this.app, this.store, {});
  },

  notFound: function notFound() {
    // kick user back to main route when 404
    this.navigate('/', { trigger: true });
  },
});

export default Router;
