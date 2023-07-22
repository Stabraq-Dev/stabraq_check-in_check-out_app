import {
  LOADING,
  REVEAL,
  REVEAL_LOGO,
  SHRINK_LOGO,
  SHOW_MY_MODAL,
  SUBMIT_TYPE,
  PICKED_DATE,
} from './types';

export const doLoading = (loadingStatus) => {
  return {
    type: LOADING,
    payload: loadingStatus,
  };
};

export const doShowMyModal = (showStatus) => {
  return {
    type: SHOW_MY_MODAL,
    payload: showStatus,
  };
};

export const submitType = (submitType) => {
  return {
    type: SUBMIT_TYPE,
    payload: submitType,
  };
};

export const doShrinkLogo = (shrinkStatus) => {
  return {
    type: SHRINK_LOGO,
    payload: shrinkStatus,
  };
};

export const doReveal = (revealStatus) => {
  return {
    type: REVEAL,
    payload: revealStatus,
  };
};

export const doRevealLogo = (revealLogoStatus) => {
  return {
    type: REVEAL_LOGO,
    payload: revealLogoStatus,
  };
};

export const doSetDatePicker = (pickedDate) => {
  return {
    type: PICKED_DATE,
    payload: pickedDate,
  };
};
