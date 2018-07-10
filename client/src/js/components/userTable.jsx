import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { updateUserTable } from '../redux/actions/index';

import 'react-table/react-table.css';
import '../../css/userTable.css';

const mapStateToProps = state => ({
  users: state.users,
});

const mapDispatchToProps = dispatch => ({
  updateUserTable: (users) => {
    dispatch(updateUserTable(users));
  },
});


class UserTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      resized: [
        {
          id: 'delete',
          value: 40,
        },
        {
          id: 'user',
          value: 140,
        },
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
          const users = [...this.props.users];
          users.splice(cellInfo.index, 1);
          // this.setState({ users });
          this.props.updateUserTable(users);
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
            const users = [...this.props.users];
            if (!event.target.innerHTML) { return; }
            users.push(event.target.innerHTML);
            event.target.innerHTML = '';
            // this.setState({ users });
            this.props.updateUserTable(users);
            event.preventDefault();
          }
        }}
      />
    );
  }

  render() {
    const { users } = this.props;
    const { resized } = this.state;
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
                  id: 'user',
                  accessor: user => user,
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

const ConnectedUserTable = connect(mapStateToProps, mapDispatchToProps)(UserTable);

export default ConnectedUserTable;
