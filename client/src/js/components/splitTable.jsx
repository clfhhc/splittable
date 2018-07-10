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
    };
    this.page = {
      0: <CostTable />,
    };
  }


  render() {
    const { page } = this.state;
    return (
      <div className="split-table-frame">
        {this.page[page]}
        <div className="side-tabs">
          <div className="side-modal-overlay" />
          <UserTable />
        </div>
      </div>
    );
  }
}

export default SplitTable;
