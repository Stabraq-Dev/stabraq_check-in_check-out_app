import React, { Component } from 'react';
import { connect } from 'react-redux';
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

export class ClientsList extends Component {
  state = { activeIndex: null, currentPage: 1, clientsPerPage: 100 };
  componentDidMount() {
    this.mobile = new URLSearchParams(window.location.search).get('mobile');
    this.btnRef = React.createRef();
    this.onStart();
    this.props.doSortList('Sheet', 999);
  }

  componentDidUpdate(prevProps) {
    if (this.btnRef.current !== null) {
      window.addEventListener('scroll', this.handleScroll);
    }

    if (
      prevProps.clientsListFiltered.length !==
        this.props.clientsListFiltered.length ||
      prevProps.sortList.sortBy !== this.props.sortList.sortBy ||
      prevProps.orderListAscending !== this.props.orderListAscending
    ) {
      this.setState({ activeIndex: null, currentPage: 1 });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.props.doClearSorting();
    this.props.doClearClientsList();
  }

  handleScroll = () => {
    const btn = this.btnRef.current;
    document.body.scrollTop > 400 || document.documentElement.scrollTop > 400
      ? (btn.style.display = 'block')
      : (btn.style.display = 'none');
  };

  onStart = async () => {
    await this.props.doGetClientsList();
    await this.props.doSortClientsList(999);
    if (this.mobile) {
      await this.onScroll();
    }
  };

  onScroll = async () => {
    await this.props.doGetClientsList();
    const { clientsList } = this.props;
    const userIndex = clientsList.findIndex((x) => x[0] === this.mobile);
    const userCurrentPage = Math.ceil(userIndex / this.state.clientsPerPage);
    this.setState({ activeIndex: userIndex + 3, currentPage: userCurrentPage });

    this.refs[this.mobile].current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  getOriginalRow = (mobile) => {
    const { clientsList } = this.props;
    const row = clientsList.findIndex((x) => x[0] === mobile) + 3;
    return row;
  };

  onGotoTopBtn = () => {
    document.body.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    document.documentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  renderList = (list) => {
    const { clientsList } = this.props;
    this.refs = clientsList.reduce((acc, value) => {
      acc[value[0]] = React.createRef();
      return acc;
    }, {});

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

      const originalRow = this.getOriginalRow(active[0]);
      const membershipTextColor = getColor(active[3]);
      const rowColor = originalRow % 2 === 0 ? 'row-color' : '';
      const activeClass =
        this.state.activeIndex === originalRow ? 'active' : '';
      const genderClass = active[12] === 'Male' ? 'user' : 'user outline';

      return (
        <React.Fragment key={index}>
          <div
            ref={this.refs[active[0]]}
            className={`title ${activeClass} ${rowColor}`}
            onClick={() => {
              this.state.activeIndex === originalRow
                ? this.setState({ activeIndex: null })
                : this.setState({ activeIndex: originalRow });
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
                {this.renderEdit(originalRow, active)}
                {this.renderSearch(active[0])}
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  renderEdit(row, active) {
    return (
      <div className='right floated content'>
        <Link
          to={`/preferences/main/edit-client/?row=${row}`}
          className='ui button primary'
          onClick={() => {
            this.props.setClientStateToEdit(active);
            this.props.fromURL();
          }}
        >
          Edit
        </Link>
      </div>
    );
  }

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

  renderListCount() {
    const { clientsList, clientsListFiltered } = this.props;
    const usersText = clientsListFiltered.length <= 1 ? 'User' : 'Users';
    const filteredText =
      clientsList.length === clientsListFiltered.length ? ' ' : ' Filtered ';
    const bgColor =
      clientsList.length === clientsListFiltered.length
        ? 'active-bg-color'
        : 'non-active-bg-color';
    return (
      <div className={`ui segment ${bgColor}`}>
        <div className='ui center aligned header'>
          All{filteredText}Users: {clientsListFiltered.length} {usersText}
        </div>
      </div>
    );
  }

  renderPaginationBar(finalClientsList) {
    // Change page
    const paginate = (pageNumber) => {
      this.setState({ currentPage: pageNumber });
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 1);
    };
    return (
      <div className={`ui segment center aligned active-bg-color`}>
        <div className='ui center aligned header'>
          <Pagination
            clientsPerPage={this.state.clientsPerPage}
            totalClients={finalClientsList.length}
            paginate={paginate}
            currentPage={this.state.currentPage}
          />
        </div>
      </div>
    );
  }

  render() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }
    const { clientsList, clientsListFiltered, clientsListSorted } = this.props;

    const finalClientsList =
      clientsListFiltered.length !== clientsList.length
        ? clientsListFiltered
        : clientsListSorted.length > 0
        ? clientsListSorted
        : clientsList;
    // Get current clients
    const indexOfLastClient =
      this.state.currentPage * this.state.clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - this.state.clientsPerPage;
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
          {this.renderListCount()}
          {this.renderList(finalClientsListPage)}
          <button
            ref={this.btnRef}
            onClick={this.onGotoTopBtn}
            className='goToTopBtn'
            data-tip='Go to top'
          >
            Top
          </button>
        </div>
        {this.renderPaginationBar(finalClientsList)}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading } = state.app;
  const {
    clientsList,
    clientsListFiltered,
    clientsListSorted,
    sortList,
    orderListAscending,
  } = state.user;
  return {
    loading,
    clientsList,
    clientsListFiltered,
    clientsListSorted,
    sortList,
    orderListAscending,
  };
};

export default connect(mapStateToProps, {
  doGetClientsList,
  setClientStateToEdit,
  fromURL,
  doSortList,
  doClearSorting,
  doClearClientsList,
  doSortClientsList,
})(ClientsList);
