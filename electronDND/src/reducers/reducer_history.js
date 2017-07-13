import { ADD_TO_HISTORY } from '../actions/index';

export default function(state = [], action) {
  switch(action.type) {
  case ADD_TO_HISTORY:
    console.log(state.length);
    if(state.length >= 20) {
      var chopArray = [ ...state ];
      chopArray.pop();
      return [ action.payload, ...chopArray ];
    }
    return [ action.payload, ...state ];
  }
  return state;
}
