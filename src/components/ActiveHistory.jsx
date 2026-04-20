import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  doGetAllWorkSheetsList,
  doGetAllSheetsList,
  doSetDayAsActiveHistory,
  doClearActiveHistoryLists,
  doClearActiveUsersList,
  doGetUserHistory,
  doSearchAllHistory,
} from '../actions';
import {
  ALL_CHECKED_IN_USERS,
  LIST_ALL_SHEETS_FILTERED,
  USER_HISTORY_DATA,
} from '../actions/types';
import { executeLookupUser } from '../functions/executeFunc';
import LoadingSpinner from './LoadingSpinner';
import SelectionModal from './SelectionModal';
import ActiveSheet from './ActiveSheet';

export const ActiveHistory = () => {
  const dispatch = useDispatch();
  const {
    listAllFilesFiltered,
    listAllSheetsFiltered,
    allCheckedInUsers,
    userHistoryData,
  } = useSelector((state) => state.user);
  const { mobileNumber } = useSelector((state) => state.user.valuesMatched);

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [monthModalOpen, setMonthModalOpen] = useState(false);
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [loadingDays, setLoadingDays] = useState(false);
  const [loadingDay, setLoadingDay] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchProgress, setSearchProgress] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchBy, setSearchBy] = useState('mobile');
  const [searchScope, setSearchScope] = useState('all');
  const [verifiedUser, setVerifiedUser] = useState(null); // { name, mobile, exists }
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      dispatch(doGetAllWorkSheetsList());
    }, 100);

    return () => {
      dispatch(doClearActiveHistoryLists());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMonthChange = async (month) => {
    setSelectedMonth(month);
    setSelectedDay('');
    dispatch({ type: USER_HISTORY_DATA, payload: [] });
    setLoadingDays(true);
    await dispatch(doGetAllSheetsList(month));
    setLoadingDays(false);
  };

  const onDayChange = async (id) => {
    setSelectedDay(id);
    if (id) {
      setLoadingDay(true);
      await dispatch(doSetDayAsActiveHistory(id, selectedMonth));
      setLoadingDay(false);
    }
  };

  const verifyMobile = async (mobile) => {
    setVerifying(true);
    setVerifiedUser(null);
    try {
      const result = await executeLookupUser(mobile, 'mobile');
      if (result.found && result.user) {
        setVerifiedUser({
          name: result.user.name,
          mobile: result.user.mobile,
          membership: result.user.membership,
          exists: true,
        });
      } else {
        setVerifiedUser({ name: null, mobile, exists: false });
      }
    } catch (err) {
      console.error('Error verifying mobile', err);
      setVerifiedUser({ name: null, mobile, exists: false });
    }
    setVerifying(false);
  };

  const onSearchHistory = async () => {
    const value = searchValue.trim();
    if (!value) return;

    // Verify mobile first
    if (searchBy === 'mobile' && !verifiedUser?.exists) {
      await verifyMobile(value);
      return;
    }

    setLoadingHistory(true);
    setSelectedDay('');
    setSearchProgress('Searching all workbooks...');
    dispatch(doClearActiveUsersList());
    dispatch({ type: ALL_CHECKED_IN_USERS, payload: [] });
    dispatch({ type: USER_HISTORY_DATA, payload: [] });

    if (searchScope === 'all') {
      await dispatch(doSearchAllHistory(value, searchBy));
    } else if (selectedMonth) {
      await dispatch(doGetUserHistory(value, selectedMonth, searchBy));
    }

    setSearchProgress('');
    setLoadingHistory(false);
  };

  const onStartSearch = async () => {
    setLoadingHistory(true);
    setSelectedDay('');
    setSearchProgress('Searching all workbooks...');
    dispatch(doClearActiveUsersList());
    dispatch({ type: ALL_CHECKED_IN_USERS, payload: [] });
    dispatch({ type: USER_HISTORY_DATA, payload: [] });

    const value = searchValue.trim();
    if (searchScope === 'all') {
      await dispatch(doSearchAllHistory(value, searchBy));
    } else if (selectedMonth) {
      await dispatch(doGetUserHistory(value, selectedMonth, searchBy));
    }

    setSearchProgress('');
    setLoadingHistory(false);
  };

  const handleClearFilters = () => {
    setSelectedMonth('');
    setSelectedDay('');
    setSearchValue('');
    setSearchProgress('');
    setLoadingDays(false);
    setLoadingDay(false);
    setLoadingHistory(false);
    dispatch(doClearActiveUsersList());
    dispatch({ type: ALL_CHECKED_IN_USERS, payload: [] });
    dispatch({ type: LIST_ALL_SHEETS_FILTERED, payload: [] });
    dispatch({ type: USER_HISTORY_DATA, payload: [] });
  };

  const selectedMonthText = listAllFilesFiltered.find(
    (o) => o.value === selectedMonth
  )?.text;
  const selectedDayText = listAllSheetsFiltered?.find(
    (o) => o.value === selectedDay
  )?.text;

  const getYearFromMonth = (option) => {
    const match = option.text.match(/(20\d{2})/);
    return match ? match[1] : '';
  };

  const renderHistoryRecord = (record, recordIdx) => {
    // record: [name, mobile, email, membership, status, checkIn, checkOut, duration, approxDuration, cost, ?, room, inviteExists, inviteMobile, inviteName]
    const name = record[0] || '';
    const membership = record[3] || '';
    const checkIn = record[5] || '';
    const checkOut = record[6] || '';
    const duration = record[7] || '';
    const cost = record[9] || '';
    const room = record[11] || '';

    return (
      <div
        key={recordIdx}
        className={`d-flex flex-wrap align-items-center gap-2 p-2 ${recordIdx % 2 === 0 ? 'row-color' : ''}`}
        style={{ borderRadius: '6px', fontSize: '0.85rem' }}
      >
        <span className='fw-bold'>{name}</span>
        <span style={{ color: 'var(--stabraq-muted)', fontSize: '0.75rem' }}>
          {membership}
        </span>
        <span>
          <i className='sign-in icon' style={{ color: 'var(--stabraq-green)', fontSize: '0.75rem' }} />
          {checkIn}
        </span>
        {checkOut && (
          <span>
            <i className='sign-out icon' style={{ color: '#ff4444', fontSize: '0.75rem' }} />
            {checkOut}
          </span>
        )}
        {duration && <span>{duration} HR</span>}
        {cost && <span style={{ fontWeight: 600 }}>{cost} EGP</span>}
        {room && <span className='text-danger'>{room}</span>}
      </div>
    );
  };

  const renderUserHistoryData = () => {
    return userHistoryData.map((ele, idx) => {
      const dayLabel = ele.month
        ? `${ele.month} / ${ele.day}`
        : ele.day;
      return (
        <div key={idx} className='mb-2'>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--stabraq-dark)',
            padding: '6px 12px',
            background: 'var(--stabraq-green-bg)',
            borderRadius: '6px 6px 0 0',
            borderLeft: '3px solid var(--stabraq-green)',
          }}>
            {dayLabel}
            <span style={{ color: 'var(--stabraq-muted)', marginLeft: '8px' }}>
              ({ele.record.length})
            </span>
          </div>
          <div style={{
            border: '1px solid #eee',
            borderTop: 'none',
            borderRadius: '0 0 6px 6px',
            overflow: 'hidden',
          }}>
            {ele.record.map((record, rIdx) =>
              renderHistoryRecord(record, rIdx)
            )}
          </div>
        </div>
      );
    });
  };

  if (listAllFilesFiltered.length <= 1) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Search Section - Always visible */}
      <div className='ui segment content-card'>
        <div className='filter-sort-toolbar'>
          <div className='toolbar-group'>
            <span className='toolbar-label'>Search By</span>
            <button
              className={`toolbar-btn ${searchBy === 'mobile' ? 'active' : ''}`}
              onClick={() => { setSearchBy('mobile'); setSearchValue(''); }}
            >
              Mobile
            </button>
            <button
              className={`toolbar-btn ${searchBy === 'name' ? 'active' : ''}`}
              onClick={() => { setSearchBy('name'); setSearchValue(''); }}
            >
              Name
            </button>
          </div>

          <div className='toolbar-divider' />

          <div className='toolbar-group'>
            <span className='toolbar-label'>Scope</span>
            <button
              className={`toolbar-btn ${searchScope === 'all' ? 'active' : ''}`}
              onClick={() => setSearchScope('all')}
            >
              All Months
            </button>
            <button
              className={`toolbar-btn ${searchScope === 'month' ? 'active' : ''}`}
              onClick={() => setSearchScope('month')}
              disabled={!selectedMonth}
            >
              Selected Month
            </button>
          </div>
        </div>

        <div className='d-flex gap-2 mt-2'>
          <input
            className='toolbar-input'
            style={{ maxWidth: 'none', flex: 1 }}
            placeholder={searchBy === 'mobile' ? '01xxxxxxxxx' : 'arabic / english'}
            maxLength={searchBy === 'mobile' ? 11 : ''}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setVerifiedUser(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && onSearchHistory()}
          />
          {/* For mobile: first click verifies, for name: search directly */}
          {searchBy === 'mobile' && !verifiedUser ? (
            <button
              className='toolbar-btn active'
              onClick={() => verifyMobile(searchValue.trim())}
              disabled={!searchValue.trim() || verifying}
              style={{ whiteSpace: 'nowrap' }}
            >
              <i className='check icon me-1' />
              {verifying ? 'Checking...' : 'Verify'}
            </button>
          ) : (
            <button
              className='toolbar-btn active'
              onClick={searchBy === 'mobile' ? onStartSearch : onSearchHistory}
              disabled={!searchValue.trim() || loadingHistory || (searchScope === 'month' && !selectedMonth)}
              style={{ whiteSpace: 'nowrap' }}
            >
              <i className='search icon me-1' />
              Search
            </button>
          )}
          {mobileNumber && (
            <button
              className='toolbar-btn'
              onClick={() => {
                setSearchValue(mobileNumber);
                setSearchBy('mobile');
                setVerifiedUser(null);
              }}
              style={{ whiteSpace: 'nowrap' }}
            >
              {mobileNumber}
            </button>
          )}
        </div>

        {/* Verified User Info */}
        {verifying && (
          <div className='text-center mt-2'>
            <LoadingSpinner message='Verifying mobile number...' />
          </div>
        )}
        {verifiedUser && (
          <div className='mt-2' style={{
            padding: '10px 16px',
            borderRadius: '8px',
            background: verifiedUser.exists ? 'var(--stabraq-green-bg)' : '#fff0f0',
            border: `1px solid ${verifiedUser.exists ? 'var(--stabraq-green)' : '#ff4444'}`,
          }}>
            {verifiedUser.exists ? (
              <div className='d-flex align-items-center gap-2 flex-wrap'>
                <i className='user icon' style={{ color: 'var(--stabraq-green)' }} />
                <span style={{ fontWeight: 600 }}>{verifiedUser.name}</span>
                <span style={{ color: 'var(--stabraq-muted)', fontSize: '0.85rem' }}>
                  {verifiedUser.mobile}
                </span>
                {verifiedUser.membership && (
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: 'var(--stabraq-green-bg)',
                    color: 'var(--stabraq-green)',
                    fontWeight: 600,
                  }}>
                    {verifiedUser.membership}
                  </span>
                )}
              </div>
            ) : (
              <div className='d-flex align-items-center gap-2'>
                <i className='warning circle icon' style={{ color: '#ff4444' }} />
                <span style={{ color: '#ff4444' }}>
                  Mobile number not found in clients list
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading History Search */}
      {loadingHistory && (
        <div className='text-center mb-3'>
          <LoadingSpinner message={searchProgress || 'Searching...'} />
        </div>
      )}

      {/* Search Results (show progressively even while loading) */}
      {userHistoryData?.length > 0 && (() => {
        const totalRecords = userHistoryData.reduce((sum, d) => sum + d.record.length, 0);
        const firstRecord = userHistoryData[0]?.record?.[0];
        const userName = searchBy === 'mobile' && firstRecord ? firstRecord[0] : null;
        return (
        <>
          <div className='d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2'>
            <div>
              {userName && (
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--stabraq-dark)' }}>
                  <i className='user icon me-1' />{userName}
                </div>
              )}
              <span style={{ fontSize: '0.85rem', color: 'var(--stabraq-muted)' }}>
                {loadingHistory ? 'Found so far: ' : 'Found '}
                {totalRecords} records across {userHistoryData.length} days
                {loadingHistory && '...'}
              </span>
            </div>
            <button
              className='toolbar-btn'
              onClick={() => dispatch({ type: USER_HISTORY_DATA, payload: [] })}
            >
              <i className='close icon me-1' />
              Clear Results
            </button>
          </div>
          {renderUserHistoryData()}
        </>
        );
      })()}

      {/* Divider between search and browse */}
      {!loadingHistory && userHistoryData?.length === 0 && (
        <div style={{ borderBottom: '1px solid #eee', margin: '8px 0 16px' }} />
      )}

      {/* Month Selector */}
      {!loadingHistory && (
        <div
          className='selection-trigger'
          onClick={() => setMonthModalOpen(true)}
        >
          <div>
            <div className='trigger-label'>Browse by Month</div>
            <div className={`trigger-value ${!selectedMonthText ? 'placeholder' : ''}`}>
              {selectedMonthText || 'Select Month...'}
            </div>
          </div>
          <i className='chevron down icon trigger-icon' />
        </div>
      )}

      <SelectionModal
        title='Select Month'
        options={listAllFilesFiltered}
        selectedValue={selectedMonth}
        onSelect={onMonthChange}
        onClose={() => setMonthModalOpen(false)}
        isOpen={monthModalOpen}
        groupBy={getYearFromMonth}
      />

      {/* Clear Filters */}
      {selectedMonth && !loadingHistory && (
        <div className='text-center mb-3'>
          <button
            className='ui button btn-stabraq'
            onClick={handleClearFilters}
            type='button'
            style={{ fontSize: '0.85rem' }}
          >
            <i className='undo icon me-1' />
            Clear All
          </button>
        </div>
      )}

      {/* Loading Days */}
      {loadingDays && (
        <div className='text-center mb-3'>
          <LoadingSpinner />
        </div>
      )}

      {/* Day Selector */}
      {!loadingDays && !loadingHistory && listAllSheetsFiltered?.length > 1 && (
        <>
          <div
            className='selection-trigger'
            onClick={() => setDayModalOpen(true)}
          >
            <div>
              <div className='trigger-label'>Day</div>
              <div className={`trigger-value ${!selectedDayText ? 'placeholder' : ''}`}>
                {selectedDayText || 'Select Day...'}
              </div>
            </div>
            <i className='chevron down icon trigger-icon' />
          </div>

          <SelectionModal
            title='Select Day'
            options={listAllSheetsFiltered}
            selectedValue={selectedDay}
            onSelect={onDayChange}
            onClose={() => setDayModalOpen(false)}
            isOpen={dayModalOpen}
            renderItem={(option) => (
              <div className='d-flex justify-content-between align-items-center'>
                <span>{option.text}</span>
                {option.rowCount !== null && option.rowCount !== undefined && (
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: option.rowCount > 0 ? 'var(--stabraq-green-bg)' : '#f5f5f5',
                    color: option.rowCount > 0 ? 'var(--stabraq-green)' : '#aaa',
                    fontWeight: 600,
                  }}>
                    {option.rowCount > 0 ? `${option.rowCount}` : 'Empty'}
                  </span>
                )}
              </div>
            )}
          />
        </>
      )}

      {/* Loading Day Data */}
      {loadingDay && (
        <div className='text-center mb-3'>
          <LoadingSpinner />
        </div>
      )}

      {/* No Records */}
      {!loadingDay && !loadingHistory && selectedMonth && selectedDay && (!allCheckedInUsers || allCheckedInUsers.length === 0) && (
        <div className='ui segment content-card text-center'>
          <p style={{ color: '#666', margin: '20px 0' }}>
            No records found for this day.
          </p>
        </div>
      )}

      {/* Active Sheet */}
      {!loadingDay && allCheckedInUsers?.length > 0 && selectedMonth && selectedDay && (
        <ActiveSheet />
      )}
    </>
  );
};

export default ActiveHistory;
