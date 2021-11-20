import React from 'react';
import { connect } from 'react-redux';
import { doCheckInOut } from '../actions';
import history from '../history';
import LoadingSpinner from './LoadingSpinner';

class CheckInOut extends React.Component {
  state = { girlsRoomChecked: false, privateRoomChecked: false };

  componentDidMount() {
    if (!this.props.showCheckInOut) {
      history.push('/preferences/main/user');
    }
  }

  onCheckInOut = (event) => {
    event.preventDefault();
    const girlsRoomChecked = !this.state.girlsRoomChecked ? '' : 'GIRLS_ROOM';
    const privateRoomChecked = !this.state.privateRoomChecked
      ? ''
      : 'PRIVATE_ROOM';
    this.props.doCheckInOut(
      event.target.value,
      girlsRoomChecked,
      privateRoomChecked
    );
  };

  onGirlsRoom = (event) => {
    this.setState({ girlsRoomChecked: event.target.checked });
  };

  onPrivateRoom = (event) => {
    this.setState({ privateRoomChecked: event.target.checked });
  };

  renderPrivateRoomButton = () => {
    if (this.props.checkedOut === 'NOT_CHECKED_IN')
      return (
        <div>
          <div className='form-check form-check-inline mt-3 me-3'>
            <input
              className='form-check-input m-2 p-3'
              type='checkbox'
              id='private-room'
              onChange={this.onPrivateRoom}
              disabled={this.state.girlsRoomChecked}
            />
            <label className='form-check-label mt-1 p-2' htmlFor='private-room'>
              Private Room
            </label>
          </div>
        </div>
      );
  };

  renderGirlsRoomButton = () => {
    if (
      this.props.checkedOut === 'NOT_CHECKED_IN' &&
      this.props.gender === 'Female' &&
      this.props.membership === 'NOT_MEMBER'
    )
      return (
        <div className='form-check form-check-inline mt-3 me-3'>
          <input
            className='form-check-input m-2 p-3'
            type='checkbox'
            id='girls-room'
            onChange={this.onGirlsRoom}
            disabled={this.state.privateRoomChecked}
          />
          <label className='form-check-label mt-1 p-2' htmlFor='girls-room'>
            Girls Room
          </label>
        </div>
      );
  };

  render() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    return (
      <div className='ui segment text-center'>
        <button
          className='ui primary button stabraq-bg me-3'
          name='checkIn'
          value='CHECK_IN'
          onClick={this.onCheckInOut}
          type='submit'
        >
          <i className='right arrow icon me-1' />
          Check In
        </button>
        <button
          className='ui primary button stabraq-bg ms-3'
          name='checkOut'
          value='CHECK_OUT'
          onClick={this.onCheckInOut}
          type='submit'
        >
          <i className='left arrow icon me-1' />
          Check Out
        </button>
        {this.renderPrivateRoomButton()}
        {this.renderGirlsRoomButton()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading, mobileNumber, showCheckInOut } = state.app;
  const { gender, membership, checkedOut } = state.user.valuesMatched;
  return {
    loading,
    mobileNumber,
    showCheckInOut,
    gender,
    membership,
    checkedOut,
  };
};

export default connect(mapStateToProps, { doCheckInOut })(CheckInOut);
