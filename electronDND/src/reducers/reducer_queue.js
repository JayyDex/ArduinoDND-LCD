import { UPDATE_MENU, UPDATE_QUEUE } from '../actions/index';

const INITIAL_STATE = { all: [], isOpen: false };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case UPDATE_MENU:
    return { ...state , isOpen: action.payload};
  case UPDATE_QUEUE:

  }
  return state;
}
