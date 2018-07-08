import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import ReactTable from 'react-table';

import 'react-table/react-table.css';

const mockData = [
  {
    item: 'Airbnb',
    type: 'accommodation',
    amount: 360,
    who_paid: 'David',
    notes: 'hello',
    David: 2,
    Charlie: 1,
    Tony: 3,
  },
  {
    item: 'Burger King',
    type: 'food',
    amount: 15,
    who_paid: 'David',
    notes: 'Hi',
    David: 3,
    Tony: 2,
  },
];

const mockUsers = [
  'David',
  'Charlie',
  'Tony',
  'Harry',
];

class CostTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: mockData,
      users: mockUsers,
    };
    this.calculateShare = this.calculateShare.bind(this);
    this.renderEditable = this.renderEditable.bind(this);
    this.renderUserSelection = this.renderUserSelection.bind(this);
  }

  calculateShare(userName, row) {
    const { users } = this.state;
    return (
      row.amount
      * (
        (row[userName] || 0)
        / users.reduce((sum, user) => (row[user] || 0) + sum, 0)
        - (userName === row.who_paid ? 1 : 0)
      )
    );
  }

/* eslint-disable */
  renderEditable(isNumber) {
    return (cellInfo) => (
      <div
        style={{ backgroundColor: '#fafafa' }}
        contentEditable
        suppressContentEditableWarning
        onBlur={(event) => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = isNumber ? parseFloat(event.target.innerHTML || 0) : event.target.innerHTML;
          this.setState({ data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id] || '',
        }}
      />
    );
  }

  renderUserSelection(cellInfo) {
    return (
      <select
        style={{ backgroundColor: '#fafafa' }}
        // contentEditable
        // suppressContentEditableWarning
        onChange={(event) => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = event.target.value;
          this.setState({ data });
        }}
        value={this.state.data[cellInfo.index][cellInfo.column.id] || ''}
        // dangerouslySetInnerHTML={{
        //   __html: this.state.data[cellInfo.index][cellInfo.column.id] || '',
        // }}
      >
        {this.state.users.map(user => (
          <option value={user} key={user}>{user}</option>
        ))}
      </select>
    );
  }

  render() {
    const { data, users } = this.state;
    return (
      <div>
        <ReactTable
          data={data}
          columns={[
            {
              Header: 'Cost Info',
              columns: [
                {
                  Header: 'Item',
                  accessor: 'item',
                  Cell: this.renderEditable(),
                },
                {
                  Header: 'Cost Type',
                  accessor: 'type',
                  Cell: this.renderEditable(),
                },
                {
                  Header: 'Cost',
                  accessor: 'amount',
                  Cell: this.renderEditable(true),
                },
                {
                  Header: 'Who Paid',
                  accessor: 'who_paid',
                  Cell: this.renderUserSelection,
                },
                {
                  Header: 'Notes',
                  accessor: 'description',
                  show: false,
                  Cell: this.renderEditable(),
                },
              ],
            },
            {
              Header: 'Shares',
              columns: users.map(user => ({
                Header: user,
                id: user,
                accessor: d => (d[user] || 0),
                Cell: this.renderEditable(true),
              })),
            },
            {
              Header: 'Cost Sharing',
              columns: users.map(user => ({
                Header: user,
                id: `${user}_share`,
                accessor: d => (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: Math.round(this.calculateShare(user, d) * 100) / 100 || '',
                    }}
                  />
                  // Math.round(this.calculateShare(user, d) * 100) / 100 || null
                ),
              })),
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

/* eslint-enable */

export default CostTable;
