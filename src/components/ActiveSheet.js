import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  doOrderSortActiveUsersList,
  doSortActiveUsersList,
  doSortList,
  doOrderList,
  doClearActiveUsersList,
  doClearSorting,
} from '../actions';
import LoadingSpinner from './LoadingSpinner';
import { getWorkBookWorkSheetValues } from '../functions/executeFunc';
import { VAR_SHEET_TOTAL_COST_RANGE } from '../ranges';
import FilterByMembership from './FilterByMembership';
import ListSorting from './ListSorting';

const buttons = [
  { name: 'sortByMembership', sortIndex: 3, value: 'Membership' },
  { name: 'sortByName', sortIndex: 0, value: 'Name' },
  { name: 'sortByCheckInTime', sortIndex: 5, value: 'Check In Time' },
];

export class ActiveSheet extends Component {
  state = { totalCost: '', updateSort: false, timeNow: 0 };

  componentDidMount() {
    this.setState({ totalCost: '' });
    this.props.doSortList('Check In Time', 5);
    this.tick();
    this.interval = setInterval(() => this.tick(), 60000);
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
    clearInterval(this.interval);
  }

  tick() {
    const localDate = new Date().toLocaleDateString('en-US');
    const localTime = new Date().toLocaleTimeString('en-US');
    this.setState(() => ({
      timeNow: Date.parse(`${localDate} ${localTime}`),
    }));
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
      const sortBy = this.props.sortList.sortBy;
      const membershipTextColor = getColor(active[3]);
      const rowColor =
        index % 2 === 0
          ? 'rounded-3 row-color'
          : 'border border-secondary border-1 rounded-3';
      const membershipClass =
        sortBy === 'Membership' ? 'fw-bold' : 'description';
      const inClass = sortBy === 'Check In Time' ? 'fw-bold' : 'description';
      const outClass = sortBy === 'Check Out Time' ? 'fw-bold' : 'description';

      const localDate = new Date().toLocaleDateString('en-US');
      const one = Date.parse(`${localDate} ${active[5]}`);
      const two = this.state.timeNow;
      const untilNow = (Math.abs(two - one) / 36e5).toFixed(1);

      const untilNowHM = new Date(two - one).toISOString().substring(11, 16);

      return (
        <div className={`row ${rowColor}`} key={index}>
          <div className='col m-2'>
            <div className='content col'>
              <div className='d-inline fw-bold me-1'>
                {(index + 1).toString().padStart(2, '0')}
              </div>
              <i className='large middle aligned icon user circle'></i>
              <div className='d-inline fw-bold mb-1'>{active[0]}</div>
              <div className={`${membershipClass} ${membershipTextColor}`}>
                {active[3]}
              </div>
              <div className={inClass}>In: {active[5]}</div>
              {active[6] && <div className={outClass}>Out: {active[6]}</div>}
              {active[8] && (
                <div className='description'>Duration: {active[8]} HR</div>
              )}
              {active[9] && (
                <div className='description'>Cost: {active[9]} EGP</div>
              )}
              {active[11] && (
                <div className='description text-danger'>
                  Room: {active[11]}
                </div>
              )}
              {active[12] && (
                <div className='description'>
                  Invitation: {active[12]} {active[14]}
                </div>
              )}
              {!active[6] && active[3] === 'NOT_MEMBER' && (
                <div className='description'>
                  Until Now: {untilNowHM} / {untilNow}
                </div>
              )}
            </div>
          </div>
          <div className='col d-flex align-items-center justify-content-end'>
            <div className='row'>
              {this.renderEditClient(active[1])}
              {this.renderSearch(active[1])}
            </div>
          </div>
        </div>
      );
    });
  };

  renderSearch(mobile) {
    return (
      <div className='col d-flex align-items-center justify-content-end my-1'>
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
      <div className='col d-flex align-items-center justify-content-end my-1'>
        <Link
          to={`/preferences/main/clients-list/?mobile=${mobile}`}
          className='ui button secondary'
        >
          Profile
        </Link>
      </div>
    );
  }

  onGetTotalCost = async () => {
    const workSheetId = this.props.activeSheetTitle.selectedMonth;
    const range = VAR_SHEET_TOTAL_COST_RANGE(this.props.activeSheetTitle.title);
    const totalCost = await getWorkBookWorkSheetValues(workSheetId, range);
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
    activeSheetTitle,
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
    activeSheetTitle,
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
  doSortActiveUsersList,
  doOrderSortActiveUsersList,
  doSortList,
  doOrderList,
  doClearActiveUsersList,
  doClearSorting,
})(ActiveSheet);
