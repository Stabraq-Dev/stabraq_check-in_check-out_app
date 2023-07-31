import MyModal from './MyModal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  doRevealLogo,
  doDeleteUserCheckIn,
  doDeleteUserCheckOut,
  doSignInAgain,
} from '../actions';

export const MyModalUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    userName,
    membership,
    expiryDate,
    remainDays,
    rowNumber,
    checkedOut,
    remainingHours,
    remainingOfTenDays,
    roomChecked,
    invite,
  } = useSelector((state) => state.user.valuesMatched);
  const { showMyModal, submitType, mobileNumber, error } = useSelector(
    (state) => state.app
  );
  const { numberExists, checkInOutStatus } = useSelector((state) => state.user);
  const { duration, approxDuration, cost } = useSelector(
    (state) => state.user.durationCost
  );
  const { userNameInvitation } = useSelector(
    (state) => state.user.inviteValuesMatched.userName
  );

  /**
   *
   * @a renderBody
   */
  const renderBody = () => {
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
          if (numberExists === 'EXISTS' && rowNumber === 'NOT_CHECKED_IN') {
            const welcome = /[\u0600-\u06FF]/.test(userName)
              ? 'مرحبا'
              : 'Welcome Back';
            const message = `${welcome}\n${userName}`;
            return <DefaultBody message={message} />;
          } else if (numberExists === 'NOT_EXISTS') {
            return <DefaultBody message='Not Exist' />;
          } else {
            return <DefaultBody message={`See you soon\n${userName}`} />;
          }

        case 'ON_NEW_USER_SUBMIT':
          if (numberExists === 'EXISTS') {
            return <DefaultBody message='Exist' />;
          }
          return <DefaultBody message='Form Submitted' />;
        case 'ON_EDIT_CLIENT_SUBMIT':
          return <DefaultBody message='Client Edit Updated Successfully' />;

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
                  ? `\nExpiry Date: ${expiryDate}\nRemaining Days: ${remainingDays} Days`
                  : '';
              const remainingHoursMessage =
                membership === 'HOURS_MEMBERSHIP'
                  ? `\nRemaining Hours: ${remainingHours} Hrs`
                  : '';
              const remainingOfTenDaysMessage =
                membership === '10_DAYS'
                  ? `\nRemaining of Ten Days: ${remainingOfTenDays} Days`
                  : '';
              const message = `Checked In Successfully${expRemMessage}${remainingHoursMessage}${remainingOfTenDaysMessage}`;
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
                roomChecked === 'PRIVATE_ROOM' ||
                roomChecked === 'TRAINING_ROOM' ||
                (membership === 'NOT_MEMBER' && invite === 'NO')
                  ? `\nCost: ${cost} EGP`
                  : '';
              const remainingHoursMessage =
                membership === 'HOURS_MEMBERSHIP'
                  ? `\nRemaining Hours: ${remainingHours} Hrs`
                  : '';
              const remainingOfTenDaysMessage =
                membership === '10_DAYS'
                  ? `\nRemaining Days: ${remainingOfTenDays} Days`
                  : '';
              const message = `Duration: ${duration} Hr:Min\nApprox. Duration: ${approxDuration} Hours${costMessage}${remainingHoursMessage}${remainingOfTenDaysMessage}`;
              return <DefaultBody message={message} />;
            }
          }
        case 'ON_CONFIRM_DELETE_CHECK_IN_SUBMIT':
          return (
            <DefaultBody
              message={`Are you sure you want to\ndelete user Check In?`}
            />
          );
        case 'ON_CONFIRM_DELETE_CHECK_OUT_SUBMIT':
          return (
            <DefaultBody
              message={`Are you sure you want to\ndelete user Check Out?`}
            />
          );
        case 'ON_CONFIRM_SIGN_IN_AGAIN_SUBMIT':
          return (
            <DefaultBody message={`Are you sure you want to\nSign In Again?`} />
          );
        case 'ON_DELETE_CHECK_IN_SUBMIT':
          return <DefaultBody message='Check In Deleted Successfully' />;
        case 'ON_DELETE_CHECK_OUT_SUBMIT':
          return <DefaultBody message='Check Out Deleted Successfully' />;
        case 'ON_UPDATE_CHECK_IN_SUBMIT':
          return <DefaultBody message='Check In Updated Successfully' />;
        case 'ON_UPDATE_CHECK_OUT_SUBMIT':
          return <DefaultBody message='Check Out Updated Successfully' />;
        case 'ON_INVITATIONS_EXPIRED':
          return (
            <DefaultBody
              message={`${userNameInvitation}\nNo Invitations Due to All Used`}
            />
          );
        case 'ON_NO_INVITATIONS':
          return (
            <DefaultBody
              message={`${userNameInvitation}\nDon't Have Invitations`}
            />
          );
        default:
          return null;
      }
    }
  };
  /**
   *
   * @a renderAction
   */
  const renderAction = () => {
    const goToHome = async () => {
      navigate('/');
      await dispatch(doRevealLogo(false));
      await dispatch(doRevealLogo(true));
    };
    const goToUser = () => {
      navigate('/preferences/main/user');
    };
    const goToNewUser = () => {
      navigate('/preferences/main/new-user');
    };
    const goToCheckInOut = () => {
      navigate('/preferences/main/user/check-in-out');
    };
    const goToClientsList = () => {
      navigate('/preferences/main/clients-list');
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
              navigate(`/preferences/main/user/?mobile=${mobileNumber}`);
          default:
            return () =>
              navigate(
                // `/preferences/main/qr-code-gen/?mobile=${mobileNumber}`
                `/preferences/main/user/?mobile=${mobileNumber}`
              );
        }

      case 'ON_EDIT_CLIENT_SUBMIT':
        if (error) {
          return goToClientsList;
        } else {
          return goToHome;
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
      case 'ON_DELETE_CHECK_IN_SUBMIT':
        if (error) {
          return goToCheckInOut;
        } else {
          return goToHome;
        }
      case 'ON_DELETE_CHECK_OUT_SUBMIT':
        if (error) {
          return goToCheckInOut;
        } else {
          return goToHome;
        }
      case 'ON_UPDATE_CHECK_IN_SUBMIT':
        if (error) {
          return goToCheckInOut;
        } else {
          return goToHome;
        }
      case 'ON_UPDATE_CHECK_OUT_SUBMIT':
        if (error) {
          return goToCheckInOut;
        } else {
          return goToHome;
        }
      case 'ON_INVITATIONS_EXPIRED':
        if (error) {
          return goToCheckInOut;
        } else {
          return goToCheckInOut;
        }
      case 'ON_NO_INVITATIONS':
        if (error) {
          return goToCheckInOut;
        } else {
          return goToCheckInOut;
        }
      default:
        return null;
    }
  };
  /**
   *
   * @a renderYesAction
   */
  const renderYesAction = () => {
    const deleteUserCheckIn = async () => {
      await dispatch(doDeleteUserCheckIn());
    };
    const deleteUserCheckOut = async () => {
      await dispatch(doDeleteUserCheckOut());
    };
    const signInAgain = async () => {
      await doSignInAgain();
    };
    switch (submitType) {
      case 'ON_CONFIRM_DELETE_CHECK_IN_SUBMIT':
        return deleteUserCheckIn;
      case 'ON_CONFIRM_DELETE_CHECK_OUT_SUBMIT':
        return deleteUserCheckOut;
      case 'ON_CONFIRM_SIGN_IN_AGAIN_SUBMIT':
        return signInAgain;
      default:
        return null;
    }
  };
  /**
   *
   * @a renderBodyBackground
   */
  const renderBodyBackground = () => {
    if (error) {
      return 'error-bg';
    } else if (
      submitType === 'ON_CONFIRM_DELETE_CHECK_IN_SUBMIT' ||
      submitType === 'ON_CONFIRM_DELETE_CHECK_OUT_SUBMIT' ||
      submitType === 'ON_CONFIRM_SIGN_IN_AGAIN_SUBMIT'
    ) {
      return 'bg-warning';
    } else {
      return 'stabraq-bg';
    }
  };
  /**
   *
   * @q React render
   */

  if (showMyModal) {
    return (
      <MyModal
        body={renderBody()}
        closeAction={renderAction()}
        bodyBackground={renderBodyBackground()}
        yesAction={renderYesAction()}
      />
    );
  }
  return null;
};

export default MyModalUser;
