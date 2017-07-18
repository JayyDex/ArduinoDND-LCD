import { combineReducers } from 'redux';
import HistoryReducer from './reducer_history';
import QueueReducer from './reducer_queue';

const rootReducer = combineReducers({
  history: HistoryReducer,
  queue: QueueReducer
});

export default rootReducer;
