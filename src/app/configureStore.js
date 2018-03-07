import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from '../reducers/index';

const middlewares = [];

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(createLogger());
}

export default function configureStore(preloadedState) {
  return createStore(reducers, preloadedState, composeWithDevTools(
    applyMiddleware(...middlewares)
  ));
}
