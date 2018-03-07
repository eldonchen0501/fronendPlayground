import _ from 'lodash';
import { handleActions } from 'redux-actions';
import {
  CREATE_ALERT,
  DISMISS_ALERT,
} from '../constants/AlertConstants';

const initialState = {
  activeAlerts: [],
  dismissedAlerts: [],
};
let idCounter = 0;


export default handleActions({
  [CREATE_ALERT]: (state, action) => {
    const { alertType, message, disappearAfter } = action;

    state.activeAlerts.push({
      id: idCounter += 1,
      alertType,
      message,
      disappearAfter,
    });

    return {
      ...state,
      activeAlerts: state.activeAlerts,
    };
  },

  [DISMISS_ALERT]: (state, action) => {
    const { id } = action;
    const dismissedAlert = _.find(state.activeAlerts, { id });

    state.dismissedAlerts.push(dismissedAlert);

    return {
      ...state,
      activeAlerts: _.pull(state.activeAlerts, dismissedAlert),
      dismissedAlert: state.dismissedAlerts,
    };
  },
}, initialState);
