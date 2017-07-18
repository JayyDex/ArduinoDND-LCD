export const ADD_TO_HISTORY = 'ADD_TO_HISTORY';
export const UPDATE_MENU = 'UPDATE_MENU';
export const UPDATE_QUEUE = 'UPDATE_QUEUE';

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
