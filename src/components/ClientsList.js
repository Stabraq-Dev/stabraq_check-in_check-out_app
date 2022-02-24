import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { doGetClientsList, setClientStateToEdit, fromURL } from '../actions';
import LoadingSpinner from './LoadingSpinner';

export class ClientsList extends Component {
  state = { activeIndex: null };
  componentDidMount() {
    this.mobile = new URLSearchParams(window.location.search).get('mobile');
    this.onStart();
  }

  onStart = async () => {
    await this.props.doGetClientsList();
    if (this.mobile) {
      await this.onScroll();
    }
  };

  onScroll = async () => {
    this.refs[this.mobile].current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    const { clientsList } = this.props;
    const userIndex = clientsList.findIndex((x) => x[0] === this.mobile);
    this.setState({ activeIndex: userIndex });
  };

  renderList = () => {
    const { clientsList } = this.props;
    this.refs = clientsList.reduce((acc, value) => {
      acc[value[0]] = React.createRef();
      return acc;
    }, {});

    return clientsList.map((active, index) => {
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
      const activeClass = this.state.activeIndex === index ? 'active' : '';
      const genderClass = active[12] === 'Male' ? 'user' : 'user outline';
      return (
        <React.Fragment key={index}>
          <div
            ref={this.refs[active[0]]}
            className={`title ${activeClass} ${rowColor}`}
            onClick={() => {
              this.state.activeIndex === index
                ? this.setState({ activeIndex: null })
                : this.setState({ activeIndex: index });
            }}
          >
            <i className='dropdown icon'></i>
            <i className='middle aligned icon me-2'>
              {(index + 1).toString().padStart(3, '0')}
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
                {this.renderEdit(index + 3, active)}
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
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  renderEdit(row, active) {
    return (
      <div className='right floated content mt-2'>
        <Link
          to={`/preferences/main/edit-client/?row=${row}`}
          className='ui button positive'
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

  render() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    return (
      <>
        <div className='ui styled fluid accordion mb-3'>
          {this.renderList()}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading } = state.app;
  const { clientsList } = state.user;
  return {
    loading,
    clientsList,
  };
};

export default connect(mapStateToProps, {
  doGetClientsList,
  setClientStateToEdit,
  fromURL,
})(ClientsList);
