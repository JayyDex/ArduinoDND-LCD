import { UPDATE_MENU, ADD_TO_QUEUE, SAVE_TO_QUEUE } from '../actions/index';

const INITIAL_STATE = { all: [], isOpen: false };


export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case UPDATE_MENU:
    return { ...state , isOpen: action.payload};
  case ADD_TO_QUEUE:
    return { ...state, all: [...state.all, action.payload]};
  case SAVE_TO_QUEUE:
    let updatedArray = [ ... state.all];
    let location = updatedArray.indexOf(action.payload);
    if (updatedArray[location].checked) {
      updatedArray[location]['checked'] = false;
    } else {
      updatedArray[location]['checked'] = true;
    }
    return { ...state, all: updatedArray};
  }

  return state;
}
