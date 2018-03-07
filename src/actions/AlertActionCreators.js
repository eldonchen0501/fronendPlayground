/**
 * Alert Actions
 */
import {
  CREATE_ALERT,
  DISMISS_ALERT,
  SUCCESS,
  DANGER,
  WARNING,
  INFO,
} from '../constants/AlertConstants';
import config from '../app/config';

const { defaultDisappearAfter } = config;

export default {
  createSuccessAlert: (message, disappearAfter = defaultDisappearAfter) => ({
    type: CREATE_ALERT,
    alertType: SUCCESS,
    message,
    disappearAfter,
  }),

  // By default we want red alerts to stay forever until user acknowledge it (clicks it)
  createDangerAlert: (message, disappearAfter = Infinity) => ({
    type: CREATE_ALERT,
    alertType: DANGER,
    message,
    disappearAfter,
  }),

  createWarningAlert: (message, disappearAfter = Infinity) => ({
    type: CREATE_ALERT,
    alertType: WARNING,
    message,
    disappearAfter,
  }),

  createInfoAlert: (message, disappearAfter = defaultDisappearAfter) => ({
    type: CREATE_ALERT,
    alertType: INFO,
    message,
    disappearAfter,
  }),

  dismissAlert: id => ({
    type: DISMISS_ALERT,
    id,
  }),
};
