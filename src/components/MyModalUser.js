import React, { Component } from 'react';
import MyModal from './MyModal';
import { connect } from 'react-redux';
import { doShowMyModal } from '../actions';
import history from '../history';

export class MyModalUser extends Component {
  renderBody() {
    const {
      submitType,
      numberExists,
      checkInOutStatus,
      userName,
      membership,
      expiryDate,
      remainDays,
      rowNumber,
      checkedOut,
      duration,
      approxDuration,
      cost,
      error,
    } = this.props;
    if (error) {
      return (
        <div className='text-center'>
          <h1>{error.message}</h1>
          <h1>Try Again</h1>
        </div>
      );
    } else {
      switch (submitType) {
        case 'ON_SEARCH_SUBMIT':
          if (numberExists === 'EXISTS') {
            return (
              <div className='text-center'>
                <h1>
                  {/[\u0600-\u06FF]/.test(userName) ? 'مرحبا' : 'Welcome Back'}
                  <br />
                  {userName}
                </h1>
              </div>
            );
          } else {
            return (
              <div className='text-center'>
                <h1>Not Exist</h1>
              </div>
            );
          }

        case 'ON_NEW_USER_SUBMIT':
          if (numberExists === 'EXISTS') {
            return (
              <div className='text-center'>
                <h1>EXISTS</h1>
              </div>
            );
          }
          return (
            <div className='text-center'>
              <h1>Form Submitted</h1>
            </div>
          );

        case 'ON_CHECK_IN_OUT_SUBMIT':
          if (checkInOutStatus === 'CHECK_IN') {
            /* CHECK_IN */
            console.log('Welcome CHECK_IN');
            if (rowNumber !== 'NOT_CHECKED_IN') {
              return (
                <div>
                  <h1>You already Checked In</h1>
                </div>
              );
            } else {
              const remainingDays = remainDays.includes('-')
                ? `Expired ${remainDays}`
                : ` ${remainDays} `;
              return (
                <div>
                  <h1>Checked In Successfully</h1>
                  {membership !== 'NOT_MEMBER' && expiryDate.includes('/') ? (
                    <div>
                      <h1>Expiry Date: {expiryDate}</h1>
                      <h1>
                        Remaining Days:
                        {remainingDays}
                        Days
                      </h1>
                    </div>
                  ) : null}
                </div>
              );
            }
          } else {
            /* CHECK_OUT */
            console.log('Welcome CheckOut');
            if (checkedOut === 'CHECK_OUT') {
              return (
                <div>
                  <h1>You already Checked Out</h1>
                </div>
              );
            } else if (checkedOut === 'NOT_CHECKED_IN') {
              return (
                <div>
                  <h1>{checkedOut}</h1>
                </div>
              );
            } else {
              return (
                <div>
                  {duration.includes('') ? (
                    <div>
                      <h1>Duration: {duration} Hr:Min</h1>
                      <h1>Approx. Duration: {approxDuration} Hours</h1>
                      {membership === 'NOT_MEMBER' ? (
                        <h1>Cost: {cost} EGP</h1>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            }
          }
        default:
          return null;
      }
    }
  }

  renderAction = () => {
    const {
      submitType,
      numberExists,
      checkInOutStatus,
      checkedOut,
      mobileNumber,
      error,
    } = this.props;
    switch (submitType) {
      case 'ON_SEARCH_SUBMIT':
        if (error) {
          return history.push('/preferences/main/user');
        } else {
          switch (numberExists) {
            case 'EXISTS':
              return history.push('/preferences/main/user/check-in-out');
            case 'NOT_EXISTS':
              return history.push('/preferences/main/new-user');
            default:
              return history.push('/');
          }
        }
      case 'ON_NEW_USER_SUBMIT':
        if (error) {
          return history.push('/preferences/main/new-user');
        }
        return history.push(`/preferences/main/user/?mobile=${mobileNumber}`);
      case 'ON_CHECK_IN_OUT_SUBMIT':
        if (error) {
          return history.push('/preferences/main/user/check-in-out');
        }
        switch (checkInOutStatus) {
          case 'CHECK_IN':
            return history.push('/');
          case 'CHECK_OUT':
            switch (checkedOut) {
              case 'CHECK_OUT':
                return history.push('/');
              case 'NOT_CHECKED_IN':
                return history.push('/preferences/main/user/check-in-out');
              default:
                return null;
            }
          default:
            return null;
        }
      default:
        return null;
    }
  };
  renderBodyBackground() {
    const { error } = this.props;
    if (error) {
      return 'error-bg';
    } else {
      return 'stabraq-bg';
    }
  }
  render() {
    if (this.props.showMyModal) {
      return (
        <MyModal
          body={this.renderBody()}
          closeAction={this.renderAction}
          bodyBackground={this.renderBodyBackground()}
        />
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    showMyModal: state.app.showMyModal,
    submitType: state.app.submitType,
    mobileNumber: state.app.mobileNumber,
    numberExists: state.user.numberExists,
    checkInOutStatus: state.user.checkInOutStatus,
    userName: state.user.valuesMatched.userName,
    membership: state.user.valuesMatched.membership,
    expiryDate: state.user.valuesMatched.expiryDate,
    remainDays: state.user.valuesMatched.remainDays,
    rowNumber: state.user.valuesMatched.rowNumber,
    checkedOut: state.user.valuesMatched.checkedOut,
    duration: state.user.durationCost.duration,
    approxDuration: state.user.durationCost.approxDuration,
    cost: state.user.durationCost.cost,
    error: state.app.error,
  };
};

export default connect(mapStateToProps, { doShowMyModal })(MyModalUser);
