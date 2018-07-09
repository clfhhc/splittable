import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import ReactTable from 'react-table';

import 'react-table/react-table.css';
import '../../css/costTable.css';

const mockData = [
  {
    item: 'Airbnb',
    type: 'accommodation',
    amount: 360,
    payer: 'David',
    notes: 'hello',
    David: 2,
    Charlie: 1,
    Tony: 3,
  },
  {
    item: 'Burger King',
    type: 'food',
    amount: 15,
    payer: 'David',
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

const emptyUser = '';

const emptyRow = {
  item: '',
  type: '',
  amount: 0,
  payer: '',
  notes: '',
};

class CostTable extends React.Component {
  constructor(props) {
    super(props);
    this.calculateShare = this.calculateShare.bind(this);
    this.renderEditable = this.renderEditable.bind(this);
    this.renderUserSelection = this.renderUserSelection.bind(this);
    this.state = {
      data: mockData,
      users: mockUsers,
      fields: [
        {
          Header: 'Item',
          // headerClassName: "cost-header",
          accessor: 'item',
          show: true,
          isNumber: false,
          cellCb: 0,
        },
        {
          Header: 'Cost Type',
          // headerClassName: "cost-header",
          accessor: 'type',
          show: true,
          isNumber: false,
          cellCb: 0,
        },
        {
          Header: 'Cost',
          // headerClassName: "cost-header",
          accessor: 'amount',
          show: true,
          isNumber: true,
          cellCb: 0,
        },
        {
          Header: 'Payer',
          // headerClassName: "cost-header",
          accessor: 'payer',
          show: true,
          isNumber: false,
          cellCb: 1,
        },
        {
          Header: 'Notes',
          // headerClassName: "cost-header",
          accessor: 'notes',
          show: false,
          isNumber: false,
          cellCb: 0,
        },
      ],
    };
  }

  calculateShare(userName, row) {
    const { users } = this.state;
    return (
      row.amount
      * (
        (row[userName] || 0)
        / users.reduce((sum, user) => (row[user] || 0) + sum, 0)
        - (userName === row.payer ? 1 : 0)
      )
    );
  }

  detectEmptyRow(row) {
    if (!row) { return false; }
    const { users, fields } = this.state;
    let i = 0;
    while (i < fields.length) {
      if (row[fields[i].accessor]) {
        return false;
      }
      i += 1;
    }
    i = 0;
    while (i < users.length) {
      if (row[users[i]]) {
        return false;
      }
      i += 1;
    }
    return true;
  }

/* eslint-disable */
  renderEditable(newData, isNumber) {
    return (cellInfo) => (
      <div
        // style={{ backgroundColor: '#fafafa' }}
        contentEditable
        suppressContentEditableWarning
        onBlur={(event) => {
          const data = [...this.state.data];
          data[cellInfo.index] = data[cellInfo.index] || {};
          data[cellInfo.index][cellInfo.column.id] = isNumber ? parseFloat(event.target.innerHTML || 0) : event.target.innerHTML;
          this.detectEmptyRow(data[cellInfo.index]) && data.splice(cellInfo.index, 1);
          this.setState({ data });
        }}
        dangerouslySetInnerHTML={{
          // __html: this.state.data[cellInfo.index][cellInfo.column.id] || '',
          __html: newData[cellInfo.index][cellInfo.column.id] || '',
        }}
      />
    );
  }

  renderUserSelection(newData) {
    return (cellInfo) => (
      <select
        style={{ backgroundColor: '#fafafa' }}
        // contentEditable
        // suppressContentEditableWarning
        className="user-select"
        onChange={(event) => {
          const data = [...this.state.data];
          data[cellInfo.index] = data[cellInfo.index] || {};
          data[cellInfo.index][cellInfo.column.id] = event.target.value;
          this.detectEmptyRow(data[cellInfo.index]) && data.splice(cellInfo.index, 1);
          this.setState({ data });
        }}
        // value={this.state.data[cellInfo.index][cellInfo.column.id] || ''}
        value={newData[cellInfo.index][cellInfo.column.id] || ''}
        // dangerouslySetInnerHTML={{
        //   __html: this.state.data[cellInfo.index][cellInfo.column.id] || '',
        // }}
      >
        {[...this.state.users, emptyUser].map(user => (
          <option value={user} key={user}>{user}</option>
        ))}
      </select>
    );
  }

  render() {
    const { fields, data, users } = this.state;
    let newData = [...data, {...emptyRow}];
    console.log(newData);
    return (
      <div>
        <ReactTable
          data={newData}
          columns={[
            {
              Header: 'Cost Info',
              headerClassName: "cost-header cost-info",
              columns: fields.map(field => ({
                Header: field.Header,
                accessor: field.accessor,
                show: field.show,
                Cell: field.cellCb === 0 ? this.renderEditable(newData,field.isNumber) : this.renderUserSelection(newData),
              }))
              
              // [
              //   {
              //     Header: 'Item',
              //     // headerClassName: "cost-header",
              //     accessor: 'item',
              //     Cell: this.renderEditable(newData),
              //   },
              //   {
              //     Header: 'Cost Type',
              //     // headerClassName: "cost-header",
              //     accessor: 'type',
              //     Cell: this.renderEditable(newData),
              //   },
              //   {
              //     Header: 'Cost',
              //     // headerClassName: "cost-header",
              //     accessor: 'amount',
              //     Cell: this.renderEditable(newData, true),
              //   },
              //   {
              //     Header: 'Payer',
              //     // headerClassName: "cost-header",
              //     accessor: 'payer',
              //     Cell: this.renderUserSelection(newData),
              //   },
              //   {
              //     Header: 'Notes',
              //     // headerClassName: "cost-header",
              //     accessor: 'notes',
              //     show: false,
              //     Cell: this.renderEditable(newData),
              //   },
              // ],
            },
            {
              Header: 'Shares',
              // headerClassName: "cost-header",
              columns: users.map(user => ({
                Header: user,
                // headerClassName: "cost-header",
                id: user,
                accessor: d => (d[user] || 0),
                Cell: this.renderEditable(newData,true),
              })),
            },
            {
              Header: 'Cost Sharing',
              // headerClassName: "cost-header",
              columns: users.map(user => ({
                Header: user,
                // headerClassName: "cost-header",
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
          
          showPagination={false}
          minRows={1}
          defaultPageSize={10}
          className="-striped -highlight cost-table"
        />
      </div>
    );
  }
}

/* eslint-enable */

export default CostTable;
