import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import ReactTable from 'react-table';

import 'react-table/react-table.css';
import '../../css/userTable.css';

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

class UserTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: mockUsers.map(user => ({ user })),
      resized: [
        {
          id: 'delete',
          value: 40,
        },
        {
          id: 'user',
          value: 140,
        }
      ],
    };

    this.renderDeleteButton = this.renderDeleteButton.bind(this);
    this.renderEditable = this.renderEditable.bind(this);
  }

  renderDeleteButton(cellInfo) {
    return (
      <div
        className="delete-row"
        onClick={() => {
          const users = [...this.state.users];
          users.splice(cellInfo.index, 1);
          this.setState({ users });
        }}
      />
    );
  }

  renderEditable() {
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        onKeyDown={(event) => {
          if (event.which === 13) {
            const { users } = this.state;
            if (!event.target.innerHTML) { return; }
            users.push({ user: event.target.innerHTML });
            event.target.innerHTML = '';
            this.setState({ users });
            event.preventDefault();
          }
        }}
      />
    );
  }

  render() {
    const { users, resized } = this.state;
    return (
      <div>
        <ReactTable
          data={users}
          columns={[
            {
              Header: 'Add / Delete a User',
              headerClassName: 'user-table-header',
              columns: [
                {
                  Header: '\u274c',
                  id: 'delete',
                  sortable: false,
                  Cell: this.renderDeleteButton,
                },
                {
                  Header: this.renderEditable,
                  headerClassName: 'user-input-header',
                  accessor: 'user',
                  sortable: false,
                },
              ],
            },
          ]}
          sorted={[
            {
              id: 'user',
              desc: false,
            },
          ]}

          resized={resized}
          showPagination={false}
          minRows={1}
          onResizedChange={resized => this.setState({ resized })}
          className="-striped -highlight user-table"
        />
      </div>
    );
  }
}

export default UserTable;
