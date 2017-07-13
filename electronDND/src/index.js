import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import reducers from './reducers';
import App from './components/app';

const createStoreWithMiddleware = applyMiddleware()(createStore);

// Now we can render our application into it
render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <App />
  </Provider>

  , document.getElementById('root') );
