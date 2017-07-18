import { ADD_TO_HISTORY } from '../actions/index';

export default function(state = [], action) {
  switch(action.type) {
  case ADD_TO_HISTORY:
    let copy = [...state];
    let location = copy.indexOf(action.payload);
    let check = false;

    copy.forEach((item) => {
      if(item.modified === action.payload.modified) {
        check = true;
        return;
      }
    });

    if (check) {
      return state;
    }


    if(state.length >= 20) {
      var chopArray = [ ...state ];
      chopArray.pop();
      return [ action.payload, ...chopArray ];
    }
    return [ action.payload, ...state ];
  }
  return state;
}
