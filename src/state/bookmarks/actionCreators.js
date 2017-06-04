import * as actionTypes from './actionTypes';

export function subscribe() {
  return {
    type: actionTypes.SUBSCRIBE_BOOKMARKS,
  }
}

export function unsubscribe() {
  return {
    type: actionTypes.UNSUBSCRIBE_BOOKMARKS,
  }
}
