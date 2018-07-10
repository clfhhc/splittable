import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import CostTable from './costTable';
import UserTable from './userTable';
import '../../css/splitTable.css';


class SplitTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      sideTab: false,
    };
    this.page = {
      0: <CostTable />,
    };
  }


  render() {
    const { page, sideTab } = this.state;
    return (
      <div className="split-table-frame">
        {this.page[page]}
        <div
          className={`side-tab-button ${sideTab ? 'slide-out' : ''}`}
          onClick={() => {
            this.setState({ sideTab: true });
          }}
        >
          Show Side Tables
        </div>
        <div
          className={`side-tab ${sideTab ? 'slide-in' : ''}`}
        >
          <div
            className={`side-modal-overlay ${sideTab ? 'slide-in' : ''}`}
            onClick={() => {
              this.setState({ sideTab: false });
            }}
          />
          <div
            className={`side-tab-overlay ${sideTab ? 'slide-in' : ''}`}
          >
            <div
              className="user-table-frame"
            >
              <UserTable />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SplitTable;
