import React, { Component } from 'react';
import { connect } from 'react-redux';
import { doGetActiveUsersList, doSortActiveUsersList } from '../actions';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

export class ActiveSheet extends Component {
  state = { sortedBy: 'Time' };

  componentDidMount() {
    this.props.doGetActiveUsersList();
  }

  renderCountActiveUsers = () => {
    const { activeUsersList } = this.props;
    const usersText = activeUsersList.length === 1 ? 'User' : 'Users';
    if (activeUsersList.length > 0)
      return (
        <div className='ui segment'>
          <div className='ui center aligned header'>
            Active {usersText}: {activeUsersList.length} {usersText}
          </div>
        </div>
      );
  };

  renderList = () => {
    if (this.props.activeUsersList.length === 0) {
      return (
        <div className='ui segment'>
          <div className='ui center aligned header'>No Active Users</div>
        </div>
      );
    }
    return this.props.activeUsersList.map((active, index) => {
      const getColor = (value) => {
        switch (value) {
          case 'GREEN':
            return 'text-green-member-color';
          case 'ORANGE':
            return 'text-orange-member-color';
          case '10_DAYS':
            return 'text-ten-days-member-color';
          case 'HOURS_MEMBERSHIP':
            return 'text-hours-member-color';
          case 'NOT_MEMBER':
            return 'text-not-member-color';

          default:
            return '';
        }
      };

      const membershipTextColor = getColor(active[3]);
      const rowColor = index % 2 === 0 ? 'row-color' : '';
      return (
        <div className={`item ${rowColor}`} key={index}>
          {this.renderSearch(active[1])}
          <i className='middle aligned icon'>
            {(index + 1).toString().padStart(2, '0')}
          </i>
          <i className='large middle aligned icon user circle'></i>
          <div className='content'>
            <div className='header'>{active[0]}</div>
            <div className={`description ${membershipTextColor}`}>
              {active[3]}
            </div>
            <i className='description'>{active[5]}</i>
          </div>
        </div>
      );
    });
  };

  renderSearch(mobile) {
    return (
      <div className='right floated content'>
        <Link
          to={`/preferences/main/user/?mobile=${mobile}`}
          className='ui button positive'
        >
          Search
        </Link>
      </div>
    );
  }

  sortActiveUserList = async (event, index) => {
    await this.props.doSortActiveUsersList(index);
    this.setState({
      sortedBy: event.target.value,
    });
  };

  renderSortButtons = () => {
    const { sortedBy } = this.state;
    const { activeUsersList } = this.props;
    const membership = sortedBy === 'Membership' ? 'bg-dark' : 'stabraq-bg';
    const name = sortedBy === 'Name' ? 'bg-dark' : 'stabraq-bg';
    const time = sortedBy === 'Time' ? 'bg-dark' : 'stabraq-bg';
    if (activeUsersList.length > 0)
      return (
        <div className='ui segment text-center'>
          <button
            className={`ui primary button ${membership} me-3 mt-1`}
            name='sortByMembership'
            onClick={(e) => {
              this.sortActiveUserList(e, 3);
            }}
            type='submit'
            value='Membership'
          >
            Sort by Membership
          </button>
          <button
            className={`ui primary button ${name} me-3 mt-1`}
            name='sortByName'
            onClick={(e) => {
              this.sortActiveUserList(e, 0);
            }}
            type='submit'
            value='Name'
          >
            Sort by Name
          </button>
          <button
            className={`ui primary button ${time} me-3 mt-1`}
            name='sortByTime'
            onClick={(e) => {
              this.sortActiveUserList(e, 5);
            }}
            type='submit'
            value='Time'
          >
            Sort by Time
          </button>
        </div>
      );
  };

  render() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }
    return (
      <>
        {this.renderCountActiveUsers()}
        {this.renderSortButtons()}
        <div className='ui celled list'>{this.renderList()}</div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading } = state.app;
  const { activeUsersList } = state.user;
  return {
    loading,
    activeUsersList,
  };
};

export default connect(mapStateToProps, {
  doGetActiveUsersList,
  doSortActiveUsersList,
})(ActiveSheet);
