import { UPDATE_MENU, ADD_TO_QUEUE, SAVE_TO_QUEUE, REMOVE_FROM_QUEUE, PRELOAD_QUEUE } from '../actions/index';
import ElectronJsonStorage from 'electron-json-storage';

const INITIAL_STATE = { all: [], isOpen: false };


export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case UPDATE_MENU:
    return { ...state , isOpen: action.payload};
  case ADD_TO_QUEUE:
    ElectronJsonStorage.set('queue', { isOpen: false, all: [...state.all, action.payload]});
    return { ...state, all: [...state.all, action.payload]};
  case SAVE_TO_QUEUE:
    let updatedArray = [ ... state.all];
    let location = updatedArray.indexOf(action.payload);
    if (updatedArray[location].checked) {
      updatedArray[location]['checked'] = false;
    } else {
      updatedArray[location]['checked'] = true;
    }
    ElectronJsonStorage.set('queue', { isOpen: false, all: updatedArray});
    return { ...state, all: updatedArray};
  case REMOVE_FROM_QUEUE:
    let updatedArray2 = [ ... state.all];
    if (updatedArray2.length == 1) {
      ElectronJsonStorage.set('queue', {isOpen: false, all: []});
      return {...state, all: []};
    }
    let location2 = updatedArray2.indexOf(action.payload);
    if (location2 == 0) {
      let updatedArray3 = updatedArray2.splice(1, updatedArray2.length)
      ElectronJsonStorage.set('queue', {isOpen: false, all: updatedArray3});
      return { ...state, all: updatedArray3};
    }
    updatedArray2.splice(location2, location2);
    ElectronJsonStorage.set('queue', {isOpen: false, all: updatedArray2});
    return { ...state, all: updatedArray2};
  case PRELOAD_QUEUE:
    return action.payload;
  }
  return state;
}
