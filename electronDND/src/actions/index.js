export const ADD_TO_HISTORY = 'ADD_TO_HISTORY';

export function addToHistory(people, raw, modified) {
  var JSONObj = new Object();
  JSONObj['people'] = people;
  JSONObj['raw'] = raw;
  JSONObj['modified'] = modified;

  console.log(JSONObj);

  return {
    type: ADD_TO_HISTORY,
    payload: JSONObj
  }
}
