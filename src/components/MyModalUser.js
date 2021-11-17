import React, { Component } from 'react';
import MyModal from './MyModal';
import { connect } from 'react-redux';
import { doShowMyModal, doRevealLogo } from '../actions';
import history from '../history';

export class MyModalUser extends Component {
  /**
   *
   * @a renderBody
   */
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

    const DefaultBody = ({ message }) => {
      return (
        <div className='text-center'>
          <h1 className='my-pre-wrap'>{message}</h1>
        </div>
      );
    };

    if (error) {
      const message = `${error.message}\nTry Again`;
      return <DefaultBody message={message} />;
    } else {
      switch (submitType) {
        case 'ON_SEARCH_SUBMIT':
          if (numberExists === 'EXISTS') {
            const welcome = /[\u0600-\u06FF]/.test(userName)
              ? 'مرحبا'
              : 'Welcome Back';
            const message = `${welcome}\n${userName}`;
            return <DefaultBody message={message} />;
          } else {
            return <DefaultBody message='Not Exist' />;
          }

        case 'ON_NEW_USER_SUBMIT':
          if (numberExists === 'EXISTS') {
            return <DefaultBody message='Exist' />;
          }
          return <DefaultBody message='Form Submitted' />;

        case 'ON_CHECK_IN_OUT_SUBMIT':
          if (checkInOutStatus === 'CHECK_IN') {
            /* CHECK_IN */
            if (rowNumber !== 'NOT_CHECKED_IN') {
              return <DefaultBody message='You already Checked In' />;
            } else {
              const remainingDays = remainDays.includes('-')
                ? `Expired ${remainDays}`
                : ` ${remainDays} `;
              const expRemMessage =
                membership !== 'NOT_MEMBER' && expiryDate.includes('/')
                  ? `Expiry Date: ${expiryDate}\nRemaining Days: ${remainingDays} Days`
                  : '';
              const message = `Checked In Successfully\n${expRemMessage}`;
              return <DefaultBody message={message} />;
            }
          } else {
            /* CHECK_OUT */
            if (checkedOut === 'CHECKED_OUT') {
              return <DefaultBody message='You already Checked Out' />;
            } else if (checkedOut === 'NOT_CHECKED_IN') {
              return <DefaultBody message={'Not Checked in'} />;
            } else {
              const costMessage =
                membership === 'NOT_MEMBER' ? `Cost: ${cost} EGP` : '';
              const message = `Duration: ${duration} Hr:Min\nApprox. Duration: ${approxDuration} Hours\n${costMessage}`;
              return <DefaultBody message={message} />;
            }
          }
        default:
          return null;
      }
    }
  }
  /**
   *
   * @a renderAction
   */
  renderAction = () => {
    const {
      submitType,
      numberExists,
      checkInOutStatus,
      checkedOut,
      mobileNumber,
      error,
      doRevealLogo,
    } = this.props;

    const goToHome = async () => {
      history.push('/');
      await doRevealLogo(false);
      await doRevealLogo(true);
    };
    const goToUser = () => {
      history.push('/preferences/main/user');
    };
    const goToNewUser = () => {
      history.push('/preferences/main/new-user');
    };
    const goToCheckInOut = () => {
      history.push('/preferences/main/user/check-in-out');
    };

    switch (submitType) {
      case 'ON_SEARCH_SUBMIT':
        if (error) {
          return goToUser;
        } else {
          switch (numberExists) {
            case 'EXISTS':
              return goToCheckInOut;
            case 'NOT_EXISTS':
              return goToNewUser;
            default:
              return goToHome;
          }
        }

      case 'ON_NEW_USER_SUBMIT':
        if (error) {
          return goToNewUser;
        }
        switch (numberExists) {
          case 'EXISTS':
            return () =>
              history.push(`/preferences/main/user/?mobile=${mobileNumber}`);
          default:
            return () =>
              history.push(
                `/preferences/main/qr-code-gen/?mobile=${mobileNumber}`
              );
        }

      case 'ON_CHECK_IN_OUT_SUBMIT':
        if (error) {
          return goToCheckInOut;
        }
        switch (checkInOutStatus) {
          case 'CHECK_IN':
            return goToHome;
          case 'CHECK_OUT':
            switch (checkedOut) {
              case 'CHECKED_OUT':
                return goToHome;
              case 'NOT_CHECKED_IN':
                return goToCheckInOut;
              case 'NOT_CHECKED_OUT':
                return goToHome;
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
  /**
   *
   * @a renderBodyBackground
   */
  renderBodyBackground() {
    const { error } = this.props;
    if (error) {
      return 'error-bg';
    } else {
      return 'stabraq-bg';
    }
  }
  /**
   *
   * @q React render
   */
  render() {
    if (this.props.showMyModal) {
      return (
        <MyModal
          body={this.renderBody()}
          closeAction={this.renderAction()}
          bodyBackground={this.renderBodyBackground()}
        />
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => {
  const {
    userName,
    membership,
    expiryDate,
    remainDays,
    rowNumber,
    checkedOut,
  } = state.user.valuesMatched;
  const { showMyModal, submitType, mobileNumber, error } = state.app;
  const { numberExists, checkInOutStatus } = state.user;
  const { duration, approxDuration, cost } = state.user.durationCost;

  return {
    showMyModal,
    submitType,
    mobileNumber,
    error,
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
  };
};

export default connect(mapStateToProps, { doShowMyModal, doRevealLogo })(
  MyModalUser
);
