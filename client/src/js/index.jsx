// client/src/js/index.jsx

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import SplitTable from './components/splitTable';
import configureStore from './redux/store/configureStore';
import sagas from './redux/actions/sagas';

const initialState = {

};

const store = configureStore(initialState); // can also pass in an initialState here
store.runSaga(sagas.mySelectAPage);


ReactDOM.render(
  (
    <Provider store={store}>
      <SplitTable />
    </Provider>
  ),
  document.getElementById('split-table'),
);
