import { combineReducers } from 'redux';
import HistoryReducer from './reducer_history';

const rootReducer = combineReducers({
  history: HistoryReducer
});

export default rootReducer;
