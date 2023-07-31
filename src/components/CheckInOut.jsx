import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  doCheckInOut,
  doCheckByMobile,
  doConfirmDeleteUserCheckIn,
  doConfirmDeleteUserCheckOut,
  doConfirmSignInAgain,
  doUpdateCheckIn,
  doUpdateCheckOut,
  doInvitationsExpired,
  doNoInvitations,
} from '../actions';
import { checkForMobNum } from '../functions/validation';
import InputMobile from './InputMobile';
import LoadingSpinner from './LoadingSpinner';
import RatingBar from './RatingBar';
import ResponsiveTimePickers from './ResponsiveTimePickers';

const CheckInOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, mobileNumber, showCheckInOut } = useSelector(
    (state) => state.app
  );
  const {
    gender,
    membership,
    checkedOut,
    rating,
    roomChecked,
    invite,
    inviteByMobile,
    inviteByName,
    checkInTime,
    checkOutTime,
  } = useSelector((state) => state.user.valuesMatched);
  const { trainingRoomRate, privateRoomRate, sharedHourRate, girlsHourRate } =
    useSelector((state) => state.user.hoursDailyRates);
  const { inviteNumberExists } = useSelector((state) => state.user);
  const { userName, invitations } = useSelector(
    (state) => state.user.inviteValuesMatched
  );
  const { membershipInvitation } = useSelector(
    (state) => state.user.inviteValuesMatched.membership
  );

  const [state, setState] = useState({
    girlsRoomChecked: false,
    privateRoomChecked: false,
    trainingRoomChecked: false,
    invitationChecked: false,
    invitationByMobile: '',
    errorMessage: '',
    inviteNumberExists: '',
    inviteUserName: '',
    invitationByMobileManual: '',
    invitationByUserNameManual: '',
    ratingValue: 0,
    commentText: '',
    editCheckIn: false,
    editCheckOut: false,
    newTimePickerValue: '',
  });

  useEffect(() => {
    if (!showCheckInOut) {
      navigate('/preferences/main/user');
    }
  });

  const onDeleteCheckIn = () => {
    dispatch(doConfirmDeleteUserCheckIn());
  };

  const onDeleteCheckOut = () => {
    dispatch(doConfirmDeleteUserCheckOut());
  };

  const onCheckInAgain = () => {
    dispatch(doConfirmSignInAgain());
  };

  const onEditCheckIn = () => {
    setState({ ...state, editCheckIn: !state.editCheckIn });

    switch (roomChecked) {
      case 'GIRLS_ROOM':
        return setState({
          ...state,
          girlsRoomChecked: !state.girlsRoomChecked,
        });
      case 'PRIVATE_ROOM':
        return setState({
          ...state,
          privateRoomChecked: !state.privateRoomChecked,
        });
      case 'TRAINING_ROOM':
        return setState({
          ...state,
          trainingRoomChecked: !state.trainingRoomChecked,
        });
      default:
        break;
    }

    if (invite !== 'NO') {
      setState({ ...state, invitationChecked: !state.invitationChecked });

      setState({ ...state, invitationByMobile: inviteByMobile });
      setState({ ...state, inviteNumberExists: invite });

      if (invite === 'EXISTS') {
        setState({ ...state, inviteUserName: inviteByName });
      } else {
        setState({ ...state, invitationByMobileManual: inviteByMobile });
        if (inviteByName === 'NO' || inviteByName === ' ') {
          setState({ ...state, invitationByUserNameManual: '' });
        } else {
          setState({
            ...state,
            invitationByUserNameManual: inviteByName,
          });
        }
      }
    }
  };

  const onEditCheckOut = () => {
    setState({ ...state, editCheckOut: !state.editCheckOut });
  };

  const onUpdateCheckIn = () => {
    const { roomChecked, inviteNumberExists, invitationByMobileUser } =
      handleCheckInOptions();

    dispatch(
      doUpdateCheckIn(
        roomChecked,
        inviteNumberExists,
        invitationByMobileUser,
        state.newTimePickerValue
      )
    );
  };

  const onUpdateCheckOut = () => {
    dispatch(doUpdateCheckOut(state.newTimePickerValue));
  };

  const handleCheckInOptions = () => {
    const roomChecked = state.girlsRoomChecked
      ? 'GIRLS_ROOM'
      : state.privateRoomChecked
      ? 'PRIVATE_ROOM'
      : state.trainingRoomChecked
      ? 'TRAINING_ROOM'
      : '';

    const inviteNumberExists =
      state.invitationChecked && state.inviteNumberExists
        ? state.inviteNumberExists
        : '';

    const invitationByMobileUser = state.invitationChecked
      ? state.inviteNumberExists === 'EXISTS'
        ? {
            inviteByMobile: state.invitationByMobile,
            inviteByName: state.inviteUserName,
          }
        : {
            inviteByMobile: state.invitationByMobileManual,
            inviteByName: state.invitationByUserNameManual,
          }
      : {
          inviteByMobile: '',
          inviteByName: '',
        };
    return {
      roomChecked: roomChecked,
      inviteNumberExists: inviteNumberExists,
      invitationByMobileUser: invitationByMobileUser,
    };
  };

  const onCheckInOut = (event) => {
    event.preventDefault();

    const { roomChecked, inviteNumberExists, invitationByMobileUser } =
      handleCheckInOptions();

    const ratingValue =
      state.ratingValue === 0 && rating > 0 ? rating : state.ratingValue;

    const membershipNoInvitation = [
      'NOT_MEMBER',
      '10_DAYS',
      'HOURS_MEMBERSHIP',
    ];

    if (
      state.invitationChecked &&
      membershipNoInvitation.includes(membershipInvitation)
    ) {
      dispatch(doNoInvitations());
      return;
    }

    if (
      state.invitationChecked &&
      inviteNumberExists === 'EXISTS' &&
      invitations <= 0
    ) {
      dispatch(doInvitationsExpired());
      return;
    }

    dispatch(
      doCheckInOut(
        event.target.value,
        roomChecked,
        inviteNumberExists,
        invitationByMobileUser,
        ratingValue,
        state.commentText
      )
    );
  };

  const onGirlsRoom = (event) => {
    setState({ ...state, girlsRoomChecked: event.target.checked });
  };

  const onInvitation = (event) => {
    setState({ ...state, invitationChecked: event.target.checked });
  };

  const onPrivateRoom = (event) => {
    setState({ ...state, privateRoomChecked: event.target.checked });
  };

  const onTrainingRoom = (event) => {
    setState({ ...state, trainingRoomChecked: event.target.checked });
  };

  const renderCheckInOptions = () => {
    if (
      checkedOut === 'NOT_CHECKED_IN' ||
      (checkedOut === 'NOT_CHECKED_OUT' && state.editCheckIn)
    )
      return (
        <div className='row'>
          {renderCheckInTime()}
          {renderPrivateRoomButton()}
          {renderTrainingRoomButton()}
          {renderGirlsRoomButton()}
          {renderInvitationButton()}
          {renderInvitationCheckByMobile()}
          {renderInvitationByMobileManual()}
        </div>
      );
  };

  const renderCheckOutOptions = () => {
    if (checkedOut === 'CHECKED_OUT' && state.editCheckOut)
      return <div className='row'>{renderCheckOutTime()}</div>;
  };

  const renderCheckInButton = () => {
    if (checkedOut === 'NOT_CHECKED_IN')
      return (
        <button
          className='ui primary button stabraq-bg me-3 mt-1'
          name='checkIn'
          value='CHECK_IN'
          onClick={onCheckInOut}
          type='submit'
        >
          <i className='right arrow icon me-1' />
          Check In
        </button>
      );
  };

  const renderCheckInAgainButton = () => {
    if (checkedOut === 'CHECKED_OUT')
      return (
        <button
          className='ui primary button stabraq-bg ms-3 mt-1'
          name='checkIn'
          value='CHECK_IN'
          onClick={onCheckInAgain}
          type='submit'
        >
          <i className='right arrow icon me-1' />
          Check In Again
        </button>
      );
  };

  const renderCheckOutButton = () => {
    if (!state.editCheckIn && !state.editCheckOut)
      return (
        <button
          className='ui primary button stabraq-bg ms-3 mt-1'
          name='checkOut'
          value='CHECK_OUT'
          onClick={onCheckInOut}
          type='submit'
        >
          <i className='left arrow icon me-1' />
          Check Out
        </button>
      );
  };

  const onTimePickersChange = (newTime) => {
    setState({ ...state, newTimePickerValue: newTime });
  };

  const renderCheckInTime = () => {
    if (checkedOut === 'NOT_CHECKED_OUT' && state.editCheckIn)
      return (
        <div className='myOverflowUnset'>
          <ResponsiveTimePickers
            label='Edit Check In Time'
            initValue={checkInTime}
            onTimeChange={onTimePickersChange}
          />
        </div>
      );
  };

  const renderCheckOutTime = () => {
    if (checkedOut === 'CHECKED_OUT' && state.editCheckOut)
      return (
        <div className='myOverflowUnset'>
          <ResponsiveTimePickers
            label='Edit Check Out Time'
            initValue={checkOutTime}
            onTimeChange={onTimePickersChange}
          />
        </div>
      );
  };

  const renderPrivateRoomButton = () => {
    return (
      <div className='col'>
        <div className='form-check form-check-inline mt-3 me-3'>
          <input
            className='form-check-input m-2 p-3'
            type='checkbox'
            id='private-room'
            onChange={onPrivateRoom}
            checked={state.privateRoomChecked}
            disabled={
              state.girlsRoomChecked ||
              state.trainingRoomChecked ||
              state.invitationChecked
            }
          />
          <label className='form-check-label mt-1 p-2' htmlFor='private-room'>
            Private Room ({privateRoomRate}/hr)
          </label>
        </div>
      </div>
    );
  };

  const renderTrainingRoomButton = () => {
    return (
      <div className='col'>
        <div className='form-check form-check-inline mt-3 me-3'>
          <input
            className='form-check-input m-2 p-3'
            type='checkbox'
            id='training-room'
            onChange={onTrainingRoom}
            checked={state.trainingRoomChecked}
            disabled={
              state.girlsRoomChecked ||
              state.privateRoomChecked ||
              state.invitationChecked
            }
          />
          <label className='form-check-label mt-1 p-2' htmlFor='training-room'>
            Training Room ({trainingRoomRate}/hr)
          </label>
        </div>
      </div>
    );
  };

  const renderGirlsRoomButton = () => {
    if (gender === 'Female' && membership === 'NOT_MEMBER')
      return (
        <div>
          <div className='form-check form-check-inline mt-3 me-3'>
            <input
              className='form-check-input m-2 p-3'
              type='checkbox'
              id='girls-room'
              onChange={onGirlsRoom}
              checked={state.girlsRoomChecked}
              disabled={
                state.privateRoomChecked ||
                state.trainingRoomChecked ||
                state.invitationChecked
              }
            />
            <label className='form-check-label mt-1 p-2' htmlFor='girls-room'>
              Girls Room ({girlsHourRate}/hr)
            </label>
          </div>
        </div>
      );
  };

  const renderInvitationButton = () => {
    if (membership === 'NOT_MEMBER')
      return (
        <div>
          <div className='form-check form-check-inline mt-3 me-3'>
            <input
              className='form-check-input m-2 p-3'
              type='checkbox'
              id='invitation'
              onChange={onInvitation}
              checked={state.invitationChecked}
              disabled={
                state.privateRoomChecked ||
                state.trainingRoomChecked ||
                state.girlsRoomChecked
              }
            />
            <label className='form-check-label mt-1 p-2' htmlFor='invitation'>
              Invitation
            </label>
          </div>
        </div>
      );
  };

  const renderInvitationCheckByMobile = () => {
    if (membership === 'NOT_MEMBER' && state.invitationChecked)
      return (
        <div className='text-center'>
          <form className='ui form error'>
            <div className='ui segment'>
              <InputMobile
                value={state.invitationByMobile}
                label='Invitation By Mobile Number'
                icon='mobile'
                onFormChange={handleChange}
                errorMessage={state.errorMessage}
              />
              <div>{state.inviteNumberExists}</div>
              <div>{state.inviteUserName}</div>
            </div>
          </form>
        </div>
      );
  };

  const renderInvitationByMobileManual = () => {
    if (
      membership === 'NOT_MEMBER' &&
      state.invitationChecked &&
      state.inviteNumberExists === 'NOT_EXISTS'
    )
      return (
        <div className='text-center'>
          <form className='ui form'>
            <div className='field mt-3'>
              <label>Provide Invitation by Mobile / Name</label>
            </div>
            <div className='row ui segment'>
              <div className='col-sm-2 col-xs-12 fw-bold d-flex align-items-center'>
                Mobile
              </div>
              <div className='col-sm-4 col-xs-12'>
                <input
                  type='tel'
                  maxLength={11}
                  placeholder='01xxxxxxxxx'
                  value={state.invitationByMobileManual}
                  onChange={handleChangeManual}
                />
              </div>
              <div className='col-sm-2 col-xs-12 fw-bold d-flex align-items-center'>
                Name
              </div>
              <div className='col-sm-4 col-xs-12'>
                <input
                  type='text'
                  placeholder='يفضل باللغة العربية'
                  value={state.invitationByUserNameManual}
                  onChange={handleChangeUserNameManual}
                />
              </div>
            </div>
          </form>
        </div>
      );
  };

  const handleRating = (rate) => {
    setState({ ...state, ratingValue: rate / 20 });
  };

  const renderRating = () => {
    if (checkedOut === 'NOT_CHECKED_OUT' && !state.editCheckIn)
      return (
        <div className='text-center'>
          <RatingBar
            onClick={handleRating}
            ratingValue={state.ratingValue * 20}
            initialValue={rating}
          />
        </div>
      );
  };

  const renderCommentSection = () => {
    if (checkedOut === 'NOT_CHECKED_OUT' && !state.editCheckIn)
      return (
        <div className='text-center'>
          <textarea
            name='comment'
            id='comment'
            cols='60'
            rows='3'
            placeholder='Write comment'
            onChange={handleChangeComment}
          ></textarea>
        </div>
      );
  };

  const renderDeleteCheckInButton = () => {
    if (checkedOut === 'NOT_CHECKED_OUT' && !state.editCheckIn)
      return (
        <button
          className='ui red button ms-3 mt-1'
          name='deleteCheckIn'
          value='DELETE_CHECK_IN'
          onClick={onDeleteCheckIn}
          type='submit'
        >
          <i className='trash alternate outline icon me-1' />
          Delete Check In
        </button>
      );
  };

  const renderDeleteCheckOutButton = () => {
    if (checkedOut === 'CHECKED_OUT' && !state.editCheckOut)
      return (
        <button
          className='ui red button ms-3 mt-1'
          name='deleteCheckOut'
          value='DELETE_CHECK_OUT'
          onClick={onDeleteCheckOut}
          type='submit'
        >
          <i className='trash alternate outline icon me-1' />
          Delete Check Out
        </button>
      );
  };

  const renderEditCheckInButton = () => {
    const className = !state.editCheckIn ? 'blue' : 'black';
    const btnText = !state.editCheckIn ? 'Edit Check In' : 'Cancel Edit';
    const btnIcon = !state.editCheckIn ? 'edit outline' : 'reply';
    if (checkedOut === 'NOT_CHECKED_OUT')
      return (
        <button
          className={`ui ${className} button ms-3 mt-1`}
          name='editCheckIn'
          value='EDIT_CHECK_IN'
          onClick={onEditCheckIn}
          type='submit'
        >
          <i className={`${btnIcon} icon me-1`} />
          {btnText}
        </button>
      );
  };

  const renderEditCheckOutButton = () => {
    const className = !state.editCheckOut ? 'blue' : 'black';
    const btnText = !state.editCheckOut ? 'Edit Check Out' : 'Cancel Edit';
    const btnIcon = !state.editCheckOut ? 'edit outline' : 'reply';
    if (checkedOut === 'CHECKED_OUT')
      return (
        <button
          className={`ui ${className} button ms-3 mt-1`}
          name='editCheckOut'
          value='EDIT_CHECK_OUT'
          onClick={onEditCheckOut}
          type='submit'
        >
          <i className={`${btnIcon} icon me-1`} />
          {btnText}
        </button>
      );
  };

  const renderUpdateCheckInButton = () => {
    if (checkedOut === 'NOT_CHECKED_OUT' && state.editCheckIn)
      return (
        <button
          className='ui orange button ms-3 mt-1'
          name='updateCheckIn'
          value='UPDATE_CHECK_IN'
          onClick={onUpdateCheckIn}
          type='submit'
        >
          <i className='edit icon me-1' />
          Update Check In
        </button>
      );
  };

  const renderUpdateCheckOutButton = () => {
    if (checkedOut === 'CHECKED_OUT' && state.editCheckOut)
      return (
        <button
          className='ui orange button ms-3 mt-1'
          name='updateCheckOut'
          value='UPDATE_CHECK_OUT'
          onClick={onUpdateCheckOut}
          type='submit'
        >
          <i className='edit icon me-1' />
          Update Check Out
        </button>
      );
  };

  const checkForErrors = async (mobile) => {
    setState({ ...state, errorMessage: await checkForMobNum(mobile) });
  };

  const handleChange = async ({ target }) => {
    const mobile = target.value;
    await setState({ ...state, inviteNumberExists: '', inviteUserName: '' });
    await setState({ ...state, invitationByMobile: mobile });
    await checkForErrors(mobile);
    if (mobile.length === 11 && state.errorMessage === '') {
      await dispatch(doCheckByMobile(mobile));
      setState({
        ...state,
        inviteNumberExists: inviteNumberExists,
        inviteUserName: userName,
      });

      if (inviteNumberExists === 'NOT_EXISTS') {
        setState({
          ...state,
          invitationByMobileManual: mobile,
          invitationByUserNameManual: '',
        });
      }
    }
  };

  const handleChangeManual = async ({ target }) => {
    const mobile = target.value;
    setState({ ...state, invitationByMobileManual: mobile });
  };

  const handleChangeUserNameManual = async ({ target }) => {
    const userName = target.value;
    setState({ ...state, invitationByUserNameManual: userName });
  };

  const handleChangeComment = async ({ target }) => {
    const comment = target.value;
    setState({ ...state, commentText: comment });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='ui segment text-center'>
      {renderCheckInOptions()}
      {renderCheckOutOptions()}
      {renderRating()}
      {renderCommentSection()}
      {renderCheckInButton()}
      {renderCheckOutButton()}
      {renderEditCheckInButton()}
      {renderUpdateCheckInButton()}
      {renderDeleteCheckInButton()}
      {renderEditCheckOutButton()}
      {renderUpdateCheckOutButton()}
      {renderDeleteCheckOutButton()}
      {renderCheckInAgainButton()}
    </div>
  );
};

export default CheckInOut;
