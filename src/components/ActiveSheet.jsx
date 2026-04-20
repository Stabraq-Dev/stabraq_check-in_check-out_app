import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  doSortList,
  doClearSorting,
  doSortActiveUsersList,
  doOrderSortActiveUsersList,
  doOrderList,
  doFilterActiveUsersList,
} from '../actions';
import LoadingSpinner from './LoadingSpinner';
import { getWorkBookWorkSheetValues } from '../functions/executeFunc';
import { VAR_SHEET_TOTAL_COST_RANGE } from '../ranges';
import { membershipOptions } from './react-final-form/options';

const sortButtons = [
  { name: 'sortByName', sortIndex: 0, value: 'Name' },
  { name: 'sortByMembership', sortIndex: 3, value: 'Membership' },
  { name: 'sortByCheckInTime', sortIndex: 5, value: 'Check In Time' },
  { name: 'sortByCheckOutTime', sortIndex: 6, value: 'Check Out Time' },
];

const ActiveSheet = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.app);
  const {
    activeUsersList,
    nonActiveUsersList,
    activeSheetFilteredBy,
    sortList,
    activeSheetTitle,
    activeUsersListFiltered,
    nonActiveUsersListFiltered,
  orderListAscending,
  } = useSelector((state) => state.user);
  const [state, setState] = useState({
    totalCost: '',
    timeNow: 0,
    interval: null,
  });

  useEffect(() => {
    dispatch(doSortList('Check In Time', 5));
    const intervalId = setInterval(() => tick(), 60000);
    tick();
    return () => {
      dispatch(doClearSorting());
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function tick() {
    const localDate = new Date().toLocaleDateString('en-US');
    const localTime = new Date().toLocaleTimeString('en-US');
    setState((prev) => ({
      ...prev,
      timeNow: Date.parse(`${localDate} ${localTime}`),
    }));
  }

  const handleSort = (btn) => {
    dispatch(doSortList(btn.value, btn.sortIndex));
    dispatch(doOrderList(true));
    dispatch(doSortActiveUsersList(btn.sortIndex));
  };

  const toggleOrder = () => {
    dispatch(doOrderList(!orderListAscending));
    dispatch(doOrderSortActiveUsersList());
  };

  const applyFilter = (value) => {
    dispatch(doFilterActiveUsersList(3, value, 'membership'));
  };

  const clearFilter = () => {
    dispatch(doFilterActiveUsersList(3, '', ''));
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
    if (list.length === 0) {
      return (
        <div className='ui segment content-card'>
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
      const sortBy = sortList.sortBy;
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
    const workSheetId = activeSheetTitle.selectedMonth;
    const range = VAR_SHEET_TOTAL_COST_RANGE(activeSheetTitle.title);
    const totalCost = await getWorkBookWorkSheetValues(workSheetId, range);
    setState((prev) => ({ ...prev, totalCost: totalCost[0][0] }));
  };

  const finalActiveList = activeSheetFilteredBy.filterBy
    ? activeUsersListFiltered
    : activeUsersList;
  const finalNonActiveList = activeSheetFilteredBy.filterBy
    ? nonActiveUsersListFiltered
    : nonActiveUsersList;

  const activeProps = { list: finalActiveList, type: 'Active' };
  const nonActiveProps = { list: finalNonActiveList, type: 'Non-Active' };

  if (loading) {
    return <LoadingSpinner />;
  }

  const hasUsers = activeUsersList.length > 0 || nonActiveUsersList.length > 0;

  return (
    <>
      {/* Unified Filter/Sort Toolbar */}
      {hasUsers && (
        <div className='ui segment content-card'>
          <div className='filter-sort-toolbar'>
            <div className='toolbar-group'>
              <span className='toolbar-label'>Filter</span>
              <button
                className={`toolbar-btn ${!activeSheetFilteredBy.filterBy ? 'active' : ''}`}
                onClick={clearFilter}
              >
                All
              </button>
              {membershipOptions
                .filter((o) => o.value)
                .map((opt) => (
                  <button
                    key={opt.key}
                    className={`toolbar-btn ${activeSheetFilteredBy.filterValue === opt.value ? 'active' : ''}`}
                    onClick={() => applyFilter(opt.value)}
                  >
                    {opt.text}
                  </button>
                ))}
            </div>

            <div className='toolbar-divider' />

            <div className='toolbar-group'>
              <span className='toolbar-label'>Sort</span>
              {sortButtons.map((btn) => (
                <button
                  key={btn.name}
                  className={`toolbar-btn ${sortList.sortBy === btn.value ? 'active' : ''}`}
                  onClick={() => handleSort(btn)}
                >
                  {btn.value}
                </button>
              ))}
              <button className='toolbar-btn' onClick={toggleOrder}>
                <i
                  className={`sort amount ${orderListAscending ? 'down' : 'up'} icon me-1`}
                />
                {orderListAscending ? 'Asc' : 'Desc'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Users */}
      {renderCountActiveUsers(activeProps)}
      <div className='ui celled list'>{renderList(activeProps)}</div>

      {/* Non-Active Users */}
      {renderCountActiveUsers(nonActiveProps)}
      <div className='ui celled list'>{renderList(nonActiveProps)}</div>

      {/* Total Cost */}
      {nonActiveUsersList.length > 0 && (
        <div className='ui segment content-card text-center'>
          <button
            className='ui primary button mt-1'
            onClick={onGetTotalCost}
            type='button'
          >
            Get Total Cost
          </button>
          {state.totalCost && (
            <div className='description mt-2'>
              Total Cost: {state.totalCost} EGP
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ActiveSheet;
