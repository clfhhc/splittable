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

    this.renderCostInfoHeader = this.renderCostInfoHeader.bind(this);
    this.renderDeleteButton = this.renderDeleteButton.bind(this);
    this.calculateShare = this.calculateShare.bind(this);
    this.renderEditable = this.renderEditable.bind(this);
    this.renderUserSelection = this.renderUserSelection.bind(this);

    this.state = {
      costSharingData: mockData,
      users: mockUsers,
      fields: [
        {
          Header: 'Item',
          // headerClassName: "cost-header",
          accessor: 'item',
          show: true,
          isNumber: false,
          cellCb: this.renderEditable,
          Footer: 'Sum',
        },
        {
          Header: 'Cost Type',
          // headerClassName: "cost-header",
          accessor: 'type',
          show: true,
          isNumber: false,
          cellCb: this.renderEditable,
          Footer: 'Total Cost:',
        },
        {
          Header: 'Cost',
          // headerClassName: "cost-header",
          accessor: 'amount',
          show: true,
          isNumber: true,
          cellCb: this.renderEditable,
        },
        {
          Header: 'Payer',
          // headerClassName: "cost-header",
          accessor: 'payer',
          show: true,
          isNumber: false,
          cellCb: this.renderUserSelection,
        },
        {
          Header: 'Notes',
          // headerClassName: "cost-header",
          accessor: 'notes',
          show: false,
          isNumber: false,
          cellCb: this.renderEditable,
        },
      ],
      resized: [{
        id: 'delete',
        value: 40,
      }],
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
  renderCostInfoHeader() {
    return (
      <div
        className="cost-info-header"
        onClick={(event) => {
          const { fields } = this.state;
          const newFields = fields.map(obj => ({ ...obj }));
          newFields[4].show = !newFields[4].show;
          this.setState({
            fields: newFields,
          })
        }}
      >
        Cost Info
      </div>
    );
  }

  renderDeleteButton(cellInfo) {
    return (
      <div
        className="delete-row"
        onClick={(event) => {
          const costSharingData = [...this.state.costSharingData];
          costSharingData.splice(cellInfo.index, 1);
          this.setState({ costSharingData });
        }}
      />
    )
  }

  renderEditable(newData, isNumber) {
    return (cellInfo) => (
      <div
        // style={{ backgroundColor: '#fafafa' }}
        contentEditable
        suppressContentEditableWarning
        onBlur={(event) => {
          const costSharingData = [...this.state.costSharingData];
          costSharingData[cellInfo.index] = costSharingData[cellInfo.index] || {};
          costSharingData[cellInfo.index][cellInfo.column.id] = isNumber ? parseFloat(event.target.innerHTML || 0) : event.target.innerHTML;
          this.detectEmptyRow(costSharingData[cellInfo.index]) && costSharingData.splice(cellInfo.index, 1);
          this.setState({ costSharingData });
        }}
        dangerouslySetInnerHTML={{
          __html: newData[cellInfo.index][cellInfo.column.id] || '',
        }}
      />
    );
  }

  renderUserSelection(newData) {
    return (cellInfo) => (
      <select
        style={{ backgroundColor: '#fafafa' }}
        className="user-select"
        onChange={(event) => {
          const costSharingData = [...this.state.costSharingData];
          costSharingData[cellInfo.index] = costSharingData[cellInfo.index] || {};
          costSharingData[cellInfo.index][cellInfo.column.id] = event.target.value;
          this.detectEmptyRow(costSharingData[cellInfo.index]) && costSharingData.splice(cellInfo.index, 1);
          this.setState({ costSharingData });
        }}
        value={newData[cellInfo.index][cellInfo.column.id] || ''}
      >
        {[...this.state.users, emptyUser].map(user => (
          <option value={user} key={user}>{user}</option>
        ))}
      </select>
    );
  }

  render() {
    const { fields, costSharingData, users, resized } = this.state;
    let newData = [...costSharingData, {...emptyRow}];
    console.log(newData);
    return (
      <div>
        <ReactTable
          data={newData}
          columns={[
            {
              columns:[{
                Header: '\u274c',
                id: 'delete',
                // accessor: d => '\u274c',
                Cell: this.renderDeleteButton,
              }],
            },
            {
              Header: this.renderCostInfoHeader,
              headerClassName: "cost-header cost-info",
              columns: fields.map(field => ({
                Header: field.Header,
                accessor: field.accessor,
                show: field.show,
                Cell: field.cellCb(newData, field.isNumber),
                Footer: field.Footer,
              }))
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
          
          resized={resized}
          showPagination={false}
          minRows={1}
          defaultPageSize={10}
          onResizedChange={resized => this.setState({ resized })}
          className="-striped -highlight cost-table"
        />
      </div>
    );
  }
}

/* eslint-enable */

export default CostTable;
