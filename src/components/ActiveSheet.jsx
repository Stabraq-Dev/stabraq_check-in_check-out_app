import { useEffect, useState } from 'react';
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

const ActiveSheet = (props) => {
  const {
    activeUsersList,
    nonActiveUsersList,
    activeSheetFilteredBy,
    activeUsersListFiltered,
    nonActiveUsersListFiltered,
  } = props;

  const [state, setState] = useState({
    totalCost: '',
    updateSort: false,
    timeNow: 0,
    interval: null,
  });

  useEffect(() => {
    setState({ ...state, totalCost: '' });
    props.doSortList('Check In Time', 5);
    setState({ ...state, interval: setInterval(() => tick(), 60000) });
    tick();
    return () => {
      // props.doClearActiveUsersList();
      props.doClearSorting();
      clearInterval(state.interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // if (nonActiveUsersList) {
    //   setState({ ...state, totalCost: '' });
    // }

    // if (props.sortList.sortBy) {
    //   setState({ ...state, updateSort: true });
    // }

    const { index } = props.sortList;
    if (state.updateSort) {
      props.doSortActiveUsersList(index);
    }
  });

  function tick() {
    const localDate = new Date().toLocaleDateString('en-US');
    const localTime = new Date().toLocaleTimeString('en-US');
    setState(() => ({
      ...state,
      timeNow: Date.parse(`${localDate} ${localTime}`),
    }));
  }

  const renderFilterActiveUsers = () => {
    const { activeUsersList, nonActiveUsersList } = props;

    if (activeUsersList.length > 0 || nonActiveUsersList.length > 0) {
      return <FilterByMembership />;
    }
  };
  const renderCountActiveUsers = ({ list, type }) => {
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

  const renderList = ({ list, type }) => {
    const { activeSheetFilteredBy } = props;
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
      const sortBy = props.sortList.sortBy;
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
      const two = state.timeNow;
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
              {renderEditClient(active[1])}
              {renderSearch(active[1])}
            </div>
          </div>
        </div>
      );
    });
  };

  const renderSearch = (mobile) => {
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
  };
  const renderEditClient = (mobile) => {
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
  };

  const onGetTotalCost = async () => {
    const workSheetId = props.activeSheetTitle.selectedMonth;
    const range = VAR_SHEET_TOTAL_COST_RANGE(props.activeSheetTitle.title);
    const totalCost = await getWorkBookWorkSheetValues(workSheetId, range);
    setState({ ...state, totalCost: totalCost[0][0] });
  };

  const renderActiveSortBar = () => {
    const { activeUsersList, activeSheetFilteredBy } = props;

    if (activeUsersList.length > 0 && !activeSheetFilteredBy.filterBy)
      return (
        <div className='ui segment text-center'>
          <ListSorting buttons={buttons} />
        </div>
      );
  };

  const renderNonActiveSortBar = () => {
    const nonActiveButtons = [
      ...buttons,
      {
        name: 'sortByCheckOutTime',
        sortIndex: 6,
        value: 'Check Out Time',
      },
    ];

    const { nonActiveUsersList, activeSheetFilteredBy } = props;

    if (nonActiveUsersList.length > 0 && !activeSheetFilteredBy.filterBy)
      return (
        <div className='ui segment text-center'>
          <ListSorting buttons={nonActiveButtons} />
        </div>
      );
  };

  const renderGetTotalCostButtons = () => {
    const { nonActiveUsersList } = props;

    if (nonActiveUsersList.length > 0)
      return (
        <div className='ui segment text-center'>
          <button
            className={`ui primary button mt-1`}
            name='getTotalCost'
            onClick={onGetTotalCost}
            type='submit'
            value='GET_TOTAL_COST'
          >
            Get Total Cost
          </button>
          {renderTotalCost()}
        </div>
      );
  };

  const renderTotalCost = () => {
    if (state.totalCost)
      return (
        <div className='description'>Total Cost: {state.totalCost} EGP</div>
      );
  };

  const finalActiveList = activeSheetFilteredBy.filterBy
    ? activeUsersListFiltered
    : activeUsersList;
  const finalNonActiveList = activeSheetFilteredBy.filterBy
    ? nonActiveUsersListFiltered
    : nonActiveUsersList;

  const activeProps = { list: finalActiveList, type: 'Active' };
  const nonActiveProps = { list: finalNonActiveList, type: 'Non-Active' };

  if (props.loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {renderFilterActiveUsers()}
      {renderCountActiveUsers(activeProps)}
      {renderActiveSortBar()}
      <div className='ui celled list'>{renderList(activeProps)}</div>
      {renderCountActiveUsers(nonActiveProps)}
      {renderNonActiveSortBar()}
      <div className='ui celled list'>{renderList(nonActiveProps)}</div>
      {renderGetTotalCostButtons()}
    </>
  );
};

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
