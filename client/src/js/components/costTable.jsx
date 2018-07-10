import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import ReactTable from 'react-table';

import 'react-table/react-table.css';
import '../../css/costTable.css';

const precision = 1000;

const mockData = [
  {
    item: 'Airbnb',
    type: 'accommodation',
    amount: 360 * precision,
    payer: 'David',
    notes: 'hello',
    David: 2 * precision,
    Charlie: 1 * precision,
    Tony: 3 * precision,
  },
  {
    item: 'Burger King',
    type: 'food',
    amount: 15 * precision,
    payer: 'David',
    notes: 'Hi',
    David: 3 * precision,
    Tony: 2 * precision,
  },
];

const mockUsers = [
  'David',
  'Charlie',
  'Tony',
  'Harry',
  'A',
  'B',
  'C',
  'D',
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
    this.calculateTotal = this.calculateTotal.bind(this);
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
          // Footer: 'Total Cost:',
        },
        {
          Header: 'Cost',
          // headerClassName: "cost-header",
          id: 'amount',
          accessor: d => Math.round(d.amount) / precision,
          show: true,
          isNumber: true,
          cellCb: this.renderEditable,
          Footer: () => Math.floor(this.total.cost) / precision,
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
    this.calculateTotal(this.state.costSharingData);
  }

  calculateTotal(costSharingData) {
    const { users } = this.state;
    this.total = {
      cost: 0,
      portion: {},
      balance: {},
    };
    users.forEach((user) => {
      this.total.portion[user] = 0;
      this.total.balance[user] = 0;
    });
    costSharingData.forEach((row) => {
      this.total.cost += row.amount;
      users.forEach((user) => {
        this.total.portion[user] += this.calculatePortion(user, row);
        this.total.balance[user] += this.calculateShare(user, row);
      });
    });
  }

  calculateShare(userName, row) {
    return (
      row.amount
      * (
        (row[userName] || 0)
        / this.state.users.reduce((sum, user) => (row[user] || 0) + sum, 0)
        - (userName === row.payer ? 1 : 0)
      )
    );
  }

  calculatePortion(userName, row) {
    return (
      row.amount
      * (
        (row[userName] || 0)
        / this.state.users.reduce((sum, user) => (row[user] || 0) + sum, 0)
      )
    );
  }

  calculateTotalPortion(userName) {
    return this.state.costSharingData.reduce(
      (sum, row) => sum + this.calculatePortion(userName, row),
      0,
    );
  }

  detectEmptyRow(row) {
    if (!row) { return false; }
    const { users, fields } = this.state;
    let i = 0;
    while (i < fields.length) {
      if (row[fields[i].accessor] || row[fields[i].id]) {
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
        onClick={() => {
          const costSharingData = [...this.state.costSharingData];
          costSharingData.splice(cellInfo.index, 1);
          this.calculateTotal(costSharingData);
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
          if (isNumber && isNaN(event.target.innerHTML)) {
            event.target.innerHTML = (costSharingData[cellInfo.index][cellInfo.index] || '');
            return;
          }
          costSharingData[cellInfo.index] = costSharingData[cellInfo.index] || {};
          costSharingData[cellInfo.index][cellInfo.column.id] = isNumber ? parseFloat(event.target.innerHTML || 0) * precision : event.target.innerHTML;
          this.detectEmptyRow(costSharingData[cellInfo.index]) && costSharingData.splice(cellInfo.index, 1);
          this.calculateTotal(costSharingData);
          this.setState({ costSharingData });
        }}
        onKeyDown={(event) => {
          if (event.which === 13 || (isNumber && event.which === 32)) {
            if (document.activeElement.toString() === '[object HTMLDivElement]') { document.activeElement.blur(); }
            event.preventDefault();
          }
        }}
        dangerouslySetInnerHTML={{
          __html: (isNumber ? Math.round(newData[cellInfo.index][cellInfo.column.id]) / 1000 : newData[cellInfo.index][cellInfo.column.id])|| '',
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
          this.calculateTotal(costSharingData);
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
    return (
      <div>
        <ReactTable
          data={newData}
          columns={[
            {
              columns:[{
                Header: '\u274c',
                id: 'delete',
                sortable: false,
                // accessor: d => '\u274c',
                Cell: this.renderDeleteButton,
              }],
            },
            {
              Header: this.renderCostInfoHeader,
              headerClassName: "cost-header cost-info",
              columns: fields.map(field => ({
                Header: field.Header,
                id: field.id,
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
                accessor: d => (Math.round(d[user]) / precision || 0),
                Cell: this.renderEditable(newData,true),
                Footer: () => (
                  Math.abs(this.total.portion[user]) >= 1
                    ? Math.round(this.total.portion[user]) / precision
                    : ''
                ),
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
                      __html: Math.round(this.calculateShare(user, d)) / precision || '',
                    }}
                  />
                ),
                Footer: () => (
                  Math.abs(this.total.balance[user]) >= 1
                    ? Math.round(this.total.balance[user]) / precision
                    : ''
                ),
              })),
            }
          ]}
          
          resized={resized}
          showPagination={false}
          minRows={1}
          onResizedChange={resized => this.setState({ resized })}
          className="-striped -highlight cost-table"
        />
      </div>
    );
  }
}

/* eslint-enable */

export default CostTable;
