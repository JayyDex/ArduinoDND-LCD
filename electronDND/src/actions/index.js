export const ADD_TO_HISTORY = 'ADD_TO_HISTORY';
export const UPDATE_MENU = 'UPDATE_MENU';
export const ADD_TO_QUEUE = 'ADD_TO_QUEUE';
export const SAVE_TO_QUEUE = 'SAVE_TO_QUEUE';
export const REMOVE_FROM_QUEUE = 'REMOVE_FROM_QUEUE';
export const PRELOAD_QUEUE = 'PRELOAD_QUEUE';

export function addToHistory(people, raw, modified) {
  var JSONObj = new Object();
  JSONObj['people'] = people;
  JSONObj['raw'] = raw;
  JSONObj['modified'] = modified;
  return {
    type: ADD_TO_HISTORY,
    payload: JSONObj
  }
}

export function updateBurger(state) {
  return {
    type: UPDATE_MENU,
    payload: state
  }
}

export function addToQueue(people, raw, modified) {
  var JSONObj = new Object();
  JSONObj['people'] = people;
  JSONObj['raw'] = raw;
  JSONObj['modified'] = modified;
  JSONObj['checked'] = false;
  return {
    type: ADD_TO_QUEUE,
    payload: JSONObj
  }
}

export function removeFromQueue(item) {
  return {
    type: REMOVE_FROM_QUEUE,
    payload: item
  }
}

export function preloadQueue(item) {
  return {
    type: PRELOAD_QUEUE,
    payload: item
  }
}

export function saveToQueue(item) {
  return {
    type: SAVE_TO_QUEUE,
    payload: item
  }
}
