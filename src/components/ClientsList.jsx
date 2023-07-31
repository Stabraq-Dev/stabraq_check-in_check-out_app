import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  doGetClientsList,
  setClientStateToEdit,
  fromURL,
  doSortList,
  doClearSorting,
  doClearClientsList,
  doSortClientsList,
} from '../actions';
import FilterClientsBy from './FilterClientsBy';
import ListSorting from './ListSorting';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';

const buttons = [
  { name: 'sortBySheet', sortIndex: 999, value: 'Sheet' },
  { name: 'sortByName', sortIndex: 1, value: 'Name' },
  { name: 'sortByMembership', sortIndex: 3, value: 'Membership' },
  { name: 'sortByExpiryDate', sortIndex: 4, value: 'Expiry Date' },
  { name: 'sortByRemainDays', sortIndex: 5, value: 'Remain Days' },
  { name: 'sortByGender', sortIndex: 12, value: 'Gender' },
];

export const ClientsList = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.app);
  const {
    clientsList,
    clientsListFiltered,
    clientsListSorted,
    filterClientsListValue,
  } = useSelector((state) => state.user);

  const [mobile, setMobile] = useState('');
  const [activeIndex, setActiveIndex] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage, setClientsPerPage] = useState(100);
  const btnRef = useRef(0);
  const refs = useRef([]);

  useEffect(() => {
    const mobileURL = new URLSearchParams(window.location.search).get('mobile');
    setMobile(mobileURL);
    dispatch(doSortList('Sheet', 999));

    if (btnRef.current !== null) {
      window.addEventListener('scroll', handleScroll);
    }
    // setActiveIndex(null);
    // setCurrentPage(1);

    dispatch(doGetClientsList());
    dispatch(doSortClientsList(999));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      dispatch(doClearSorting());
      dispatch(doClearClientsList());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (mobile) {
      onScroll();
    }
  });

  const handleScroll = () => {
    const btn = btnRef.current;
    if (btn) {
      document.body.scrollTop > 400 || document.documentElement.scrollTop > 400
        ? (btn.style.display = 'block')
        : (btn.style.display = 'none');
    }
  };

  const onScroll = async () => {
    // await props.doGetClientsList();
    const userIndex = clientsList.findIndex((x) => x[0] === mobile);
    const userCurrentPage = Math.ceil(userIndex / clientsPerPage);

    setActiveIndex(userIndex + 3);
    setCurrentPage(userCurrentPage);

    refs.current[mobile]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const getOriginalRow = (mobile) => {
    const row = clientsList.findIndex((x) => x[0] === mobile) + 3;
    return row;
  };

  const onGotoTopBtn = () => {
    document.body.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    document.documentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const renderList = (list) => {
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

      const originalRow = getOriginalRow(active[0]);
      const membershipTextColor = getColor(active[3]);
      const rowColor = originalRow % 2 === 0 ? 'row-color' : '';
      const activeClass = activeIndex === originalRow ? 'active' : '';
      const genderClass = active[12] === 'Male' ? 'user' : 'user outline';

      return (
        <div key={index}>
          <div
            ref={(element) => {
              refs.current[active[0]] = element;
            }}
            className={`title ${activeClass} ${rowColor}`}
            onClick={() => {
              activeIndex === originalRow
                ? setActiveIndex(null)
                : setActiveIndex(originalRow);
            }}
          >
            <i className='dropdown icon'></i>
            <i className='middle aligned icon me-3'>
              {(originalRow - 2).toString().padStart(3, '0')}
            </i>
            <i className={`large middle aligned icon ${genderClass}`}></i>
            <div className='ui breadcrumb'>
              <div className='d-inline ms-2'>{active[1]}</div>
              <i className='right angle icon divider'></i>
              <div className={`d-inline ${membershipTextColor}`}>
                ({active[3]})
              </div>
            </div>
          </div>
          <div className={`content ${activeClass}`}>
            <div className='ui celled list'>
              <div className={`item ${rowColor}`}>
                <div className='content'>
                  <div className='description mb-1'>User Name: {active[1]}</div>
                  <div className='description'>Mobile Number: {active[0]}</div>
                  <div className='description'>E-Mail Address: {active[2]}</div>
                  <div className={`description ${membershipTextColor}`}>
                    Membership: {active[3]}
                  </div>
                  {active[4] && (
                    <div className='description'>Expiry Date: {active[4]}</div>
                  )}
                  {active[5] && (
                    <div className='description'>Remain Days: {active[5]}</div>
                  )}
                  {active[6] && (
                    <div className='description'>
                      Hours Package: {active[6]}
                    </div>
                  )}
                  <div className='description'>
                    Registration Date/Time: {active[7]}
                  </div>
                  {active[8] && (
                    <div className='description'>
                      Remaining Hours: {active[8]}
                    </div>
                  )}
                  {active[9] && (
                    <div className='description'>
                      Remaining of Ten Days: {active[9]}
                    </div>
                  )}
                  {active[10] && (
                    <div className='description'>Invitations: {active[10]}</div>
                  )}
                  <div className='description'>Rating: {active[11]}</div>
                  <div className='description'>Gender: {active[12]}</div>
                  <div className='description'>Offers: {active[13]}</div>
                </div>
                {renderEdit(originalRow, active)}
                {renderQRCodeButton(active[0])}
                {renderSearch(active[0])}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  const renderEdit = (row, active) => {
    return (
      <div className='right floated content'>
        <Link
          to={`/preferences/main/edit-client/?row=${row}`}
          className='ui button primary'
          onClick={() => {
            dispatch(setClientStateToEdit(active));
            dispatch(fromURL());
          }}
        >
          Edit
        </Link>
      </div>
    );
  };

  const renderSearch = (mobile) => {
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
  };
  const renderQRCodeButton = (mobile) => {
    return (
      <div className='right floated content'>
        <Link
          to={`/preferences/main/qr-code-gen/?mobile=${mobile}`}
          className='ui button orange'
        >
          QR Code
        </Link>
      </div>
    );
  };

  const renderListCount = () => {
    const usersText = clientsListFiltered.length <= 1 ? 'User' : 'Users';
    const filteredText = clientsListFiltered.length === 0 ? ' ' : ' Filtered ';
    const count = filterClientsListValue
      ? clientsListFiltered.length
      : clientsList.length;
    const bgColor =
    filterClientsListValue.length === 0
        ? 'active-bg-color'
        : 'non-active-bg-color';
    return (
      <div className={`ui segment ${bgColor}`}>
        <div className='ui center aligned header'>
          All{filteredText}Users: {count} {usersText}
        </div>
      </div>
    );
  };

  const renderPaginationBar = (finalClientsList) => {
    // Change page
    const paginate = (pageNumber) => {
      setCurrentPage(pageNumber);
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 1);
    };
    return (
      <div className={`ui segment center aligned active-bg-color`}>
        <div className='ui center aligned header'>
          <Pagination
            clientsPerPage={clientsPerPage}
            totalClients={finalClientsList.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const finalClientsList =
    clientsListFiltered.length !== clientsList.length && filterClientsListValue
      ? clientsListFiltered
      : clientsListSorted.length > 0
      ? clientsListSorted
      : clientsList;
  // Get current clients
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const finalClientsListPage = finalClientsList.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  return (
    <>
      <div className='ui styled fluid accordion mb-3'>
        <div className='ui segment'>
          <ListSorting buttons={buttons} />
          <FilterClientsBy />
        </div>
        {renderListCount()}
        {renderList(finalClientsListPage)}
        <button
          ref={btnRef}
          onClick={onGotoTopBtn}
          className='goToTopBtn'
          data-tip='Go to top'
        >
          Top
        </button>
      </div>
      {renderPaginationBar(finalClientsList)}
    </>
  );
};

export default ClientsList;
