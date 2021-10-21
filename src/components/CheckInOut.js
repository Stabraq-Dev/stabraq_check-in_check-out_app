import React from 'react';
import { connect } from 'react-redux';
import { doCheckInOut } from '../actions';
import history from '../history';
import LoadingSpinner from './LoadingSpinner';

class CheckInOut extends React.Component {
  componentDidMount() {
    if (!this.props.showCheckInOut) {
      history.push('/preferences/main/user');
    }
  }

  onCheckInOut = (event) => {
    event.preventDefault();

    this.props.doCheckInOut(event.target.value);
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
          Check In
        </button>
        <button
          className='ui primary button stabraq-bg ms-3'
          name='checkOut'
          value='CHECK_OUT'
          onClick={this.onCheckInOut}
          type='submit'
        >
          Check Out
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading, mobileNumber, showCheckInOut } = state.app;
  return {
    loading,
    mobileNumber,
    showCheckInOut,
  };
};

export default connect(mapStateToProps, { doCheckInOut })(CheckInOut);
