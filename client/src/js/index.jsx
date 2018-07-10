// client/src/js/index.jsx

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import SplitTable from './components/splitTable';
import configureStore from './redux/store/configureStore';
// import sagas from './redux/actions/sagas';
import '../css/main.css';

const precision = 100;

const initialState = {
  users: [
    'David',
    'Charlie',
    'Tony',
  ],
  costs: [
    {
      item: 'Airbnb',
      type: 'Accommodation',
      amount: 360 * precision,
      payer: 'David',
      notes: 'Charlie only stayed for one night',
    },
    {
      item: 'Burger King',
      type: 'Food',
      amount: 14.75 * precision,
      payer: 'Charlie',
      notes: 'so dilicious',
    },
  ],
  shares: [
    {
      David: 2 * precision,
      Charlie: 1 * precision,
      Tony: 2 * precision,
    },
    {
      David: 6.89 * precision,
      Tony: (14.75 - 6.89) * precision,
    },
  ],
};

const store = configureStore(initialState); // can also pass in an initialState here
// store.runSaga(sagas.mySelectAPage);


ReactDOM.render(
  (
    <Provider store={store}>
      <SplitTable />
    </Provider>
  ),
  document.getElementById('split-table'),
);

// ReactDOM.render(
//   <SplitTable />,
//   document.getElementById('split-table'),
// );
