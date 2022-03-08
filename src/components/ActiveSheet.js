import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  doGetActiveUsersList,
  doOrderSortActiveUsersList,
  doSortActiveUsersList,
  doSortList,
  doOrderList,
  doClearActiveUsersList,
  doClearSorting,
} from '../actions';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { getSheetValues } from '../functions/executeFunc';
import { DATA_SHEET_TOTAL_COST_RANGE } from '../ranges';
import FilterByMembership from './FilterByMembership';
import ListSorting from './ListSorting';

const buttons = [
  { name: 'sortByMembership', sortIndex: 3, value: 'Membership' },
  { name: 'sortByName', sortIndex: 0, value: 'Name' },
  { name: 'sortByCheckInTime', sortIndex: 5, value: 'Check In Time' },
];

export class ActiveSheet extends Component {
  state = { totalCost: '', updateSort: false };

  componentDidMount() {
    this.props.doGetActiveUsersList();
    this.setState({ totalCost: '' });
    this.props.doSortList('Check In Time', 5);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.nonActiveUsersList !== this.props.nonActiveUsersList) {
      this.setState({ totalCost: '' });
    }

    if (prevProps.sortList.sortBy !== this.props.sortList.sortBy) {
      this.setState({ updateSort: true });
    }

    const { index } = this.props.sortList;
    if (this.state.updateSort) {
      this.props.doSortActiveUsersList(index);
    }
  }

  componentWillUnmount() {
    this.props.doClearActiveUsersList();
    this.props.doClearSorting();
  }

  renderFilterActiveUsers = () => {
    const { activeUsersList, nonActiveUsersList } = this.props;

    if (activeUsersList.length > 0 || nonActiveUsersList.length > 0) {
      return <FilterByMembership />;
    }
  };
  renderCountActiveUsers = ({ list, type }) => {
    const usersText = list.length === 1 ? 'User' : 'Users';
    const bgColor =
      type === 'Active' ? 'active-bg-color' : 'non-active-bg-color';
    if (list.length > 0)
      return (
        <div className={`ui segment ${bgColor}`}>
          <div className='ui center aligned header'>
            {type} {usersText}: {list.length} {usersText}
          </div>
        </div>
      );
  };

  renderList = ({ list, type }) => {
    const { activeSheetFilteredBy } = this.props;
    if (list.length === 0) {
      return (
        <div className='ui segment'>
          <div className='ui center aligned header'>
            No {type} {activeSheetFilteredBy.filterValue} Users
          </div>
        </div>
      );
    }
    return list.map((active, index) => {
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
          {this.renderEditClient(active[1])}
          <i className='middle aligned icon'>
            {(index + 1).toString().padStart(2, '0')}
          </i>
          <i className='large middle aligned icon user circle'></i>
          <div className='content'>
            <div className='header mb-1'>{active[0]}</div>
            <div className={`description ${membershipTextColor}`}>
              {active[3]}
            </div>
            <i className='description'>In: {active[5]}</i>
            {active[6] && <i className='description'>Out: {active[6]}</i>}
            {active[8] && (
              <div className='description'>Duration: {active[8]} HR</div>
            )}
            {active[9] && (
              <div className='description'>Cost: {active[9]} EGP</div>
            )}
            {active[11] && (
              <div className='description text-danger'>Room: {active[11]}</div>
            )}
            {active[12] && (
              <div className='description'>Invitation: {active[12]}</div>
            )}
          </div>
        </div>
      );
    });
  };

  renderSearch(mobile) {
    return (
      <div className='right floated content mt-2'>
        <Link
          to={`/preferences/main/user/?mobile=${mobile}`}
          className='ui button positive'
        >
          Search
        </Link>
      </div>
    );
  }
  renderEditClient(mobile) {
    return (
      <div className='right floated content mt-2'>
        <Link
          to={`/preferences/main/clients-list/?mobile=${mobile}`}
          className='ui button positive'
        >
          Profile
        </Link>
      </div>
    );
  }

  onGetTotalCost = async () => {
    const totalCost = await getSheetValues(DATA_SHEET_TOTAL_COST_RANGE);
    this.setState({ totalCost: totalCost[0][0] });
  };

  renderActiveSortBar = () => {
    const { activeUsersList, activeSheetFilteredBy } = this.props;

    if (activeUsersList.length > 0 && !activeSheetFilteredBy.filterBy)
      return (
        <div className='ui segment text-center'>
          <ListSorting buttons={buttons} />
        </div>
      );
  };

  renderNonActiveSortBar = () => {
    const nonActiveButtons = [
      ...buttons,
      {
        name: 'sortByCheckOutTime',
        sortIndex: 6,
        value: 'Check Out Time',
      },
    ];

    const { nonActiveUsersList, activeSheetFilteredBy } = this.props;

    if (nonActiveUsersList.length > 0 && !activeSheetFilteredBy.filterBy)
      return (
        <div className='ui segment text-center'>
          <ListSorting buttons={nonActiveButtons} />
        </div>
      );
  };

  renderGetTotalCostButtons = () => {
    const { nonActiveUsersList } = this.props;

    if (nonActiveUsersList.length > 0)
      return (
        <div className='ui segment text-center'>
          <button
            className={`ui primary button mt-1`}
            name='getTotalCost'
            onClick={this.onGetTotalCost}
            type='submit'
            value='GET_TOTAL_COST'
          >
            Get Total Cost
          </button>
          {this.renderTotalCost()}
        </div>
      );
  };

  renderTotalCost = () => {
    if (this.state.totalCost)
      return (
        <div className='description'>
          Total Cost: {this.state.totalCost} EGP
        </div>
      );
  };

  render() {
    const {
      activeUsersList,
      nonActiveUsersList,
      activeSheetFilteredBy,
      activeUsersListFiltered,
      nonActiveUsersListFiltered,
    } = this.props;
    const finalActiveList = activeSheetFilteredBy.filterBy
      ? activeUsersListFiltered
      : activeUsersList;
    const finalNonActiveList = activeSheetFilteredBy.filterBy
      ? nonActiveUsersListFiltered
      : nonActiveUsersList;

    const activeProps = { list: finalActiveList, type: 'Active' };
    const nonActiveProps = { list: finalNonActiveList, type: 'Non-Active' };

    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    return (
      <>
        {this.renderFilterActiveUsers()}
        {this.renderCountActiveUsers(activeProps)}
        {this.renderActiveSortBar()}
        <div className='ui celled list'>{this.renderList(activeProps)}</div>
        {this.renderCountActiveUsers(nonActiveProps)}
        {this.renderNonActiveSortBar()}
        <div className='ui celled list'>{this.renderList(nonActiveProps)}</div>
        {this.renderGetTotalCostButtons()}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading } = state.app;
  const {
    activeUsersList,
    nonActiveUsersList,
    activeSheetFilteredBy,
    activeUsersListFiltered,
    nonActiveUsersListFiltered,
    sortList,
    orderListAscending,
  } = state.user;
  return {
    loading,
    activeUsersList,
    nonActiveUsersList,
    activeSheetFilteredBy,
    activeUsersListFiltered,
    nonActiveUsersListFiltered,
    sortList,
    orderListAscending,
  };
};

export default connect(mapStateToProps, {
  doGetActiveUsersList,
  doSortActiveUsersList,
  doOrderSortActiveUsersList,
  doSortList,
  doOrderList,
  doClearActiveUsersList,
  doClearSorting,
})(ActiveSheet);
