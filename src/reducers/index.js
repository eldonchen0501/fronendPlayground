import { combineReducers } from 'redux';

import alert from './alert';
import card from './card';
import cuisineType from './cuisineType';
import login from './login';
import report from './report';
import restaurant from './restaurant';

export default combineReducers({
  alert,
  card,
  cuisineType,
  login,
  report,
  restaurant,
});
