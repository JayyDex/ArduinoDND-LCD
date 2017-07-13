import { ADD_TO_HISTORY } from '../actions/index';

export default function(state = [], action) {
  switch(action.type) {
  case ADD_TO_HISTORY:
    return [ action.payload, ...state ];
  }
  return state;
}
