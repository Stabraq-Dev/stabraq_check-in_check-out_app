import React from 'react';
import { connect } from 'react-redux';
import {
  doCheckInOut,
  doCheckByMobile,
  doConfirmDeleteUserCheckIn,
  doConfirmDeleteUserCheckOut,
  doUpdateCheckIn,
  doUpdateCheckOut,
} from '../actions';
import { checkForMobNum } from '../functions/validation';
import history from '../history';
import InputMobile from './InputMobile';
import LoadingSpinner from './LoadingSpinner';
import { Rating } from 'react-simple-star-rating';
import {
  MdSentimentVeryDissatisfied,
  MdSentimentDissatisfied,
  MdSentimentNeutral,
  MdSentimentSatisfiedAlt,
  MdSentimentVerySatisfied,
} from 'react-icons/md';
import ResponsiveTimePickers from './ResponsiveTimePickers';

const customIcons = [
  { icon: <MdSentimentVeryDissatisfied size={50} /> },
  { icon: <MdSentimentDissatisfied size={50} /> },
  { icon: <MdSentimentNeutral size={50} /> },
  { icon: <MdSentimentSatisfiedAlt size={50} /> },
  { icon: <MdSentimentVerySatisfied size={50} /> },
];

class CheckInOut extends React.Component {
  state = {
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
  };

  componentDidMount() {
    if (!this.props.showCheckInOut) {
      history.push('/preferences/main/user');
    }
  }

  onDeleteCheckIn = () => {
    this.props.doConfirmDeleteUserCheckIn();
  };

  onDeleteCheckOut = () => {
    this.props.doConfirmDeleteUserCheckOut();
  };

  onEditCheckIn = () => {
    this.setState({ editCheckIn: !this.state.editCheckIn });

    switch (this.props.roomChecked) {
      case 'GIRLS_ROOM':
        return this.setState({
          girlsRoomChecked: !this.state.girlsRoomChecked,
        });
      case 'PRIVATE_ROOM':
        return this.setState({
          privateRoomChecked: !this.state.privateRoomChecked,
        });
      case 'TRAINING_ROOM':
        return this.setState({
          trainingRoomChecked: !this.state.trainingRoomChecked,
        });
      default:
        break;
    }
  };

  onEditCheckOut = () => {
    this.setState({ editCheckOut: !this.state.editCheckOut });
  };

  onUpdateCheckIn = () => {
    const { roomChecked, inviteNumberExists, invitationByMobileUser } =
      this.handleCheckInOptions();

    this.props.doUpdateCheckIn(
      roomChecked,
      inviteNumberExists,
      invitationByMobileUser,
      this.state.newTimePickerValue
    );
  };

  onUpdateCheckOut = () => {
    this.props.doUpdateCheckOut(this.state.newTimePickerValue);
  };

  handleCheckInOptions = () => {
    const roomChecked = this.state.girlsRoomChecked
      ? 'GIRLS_ROOM'
      : this.state.privateRoomChecked
      ? 'PRIVATE_ROOM'
      : this.state.trainingRoomChecked
      ? 'TRAINING_ROOM'
      : '';

    const inviteNumberExists =
      this.state.invitationChecked && this.state.inviteNumberExists
        ? this.state.inviteNumberExists
        : '';

    const invitationByMobileUser = this.state.invitationChecked
      ? this.state.inviteNumberExists === 'EXISTS'
        ? {
            inviteByMobile: this.state.invitationByMobile,
            inviteByName: this.state.inviteUserName,
          }
        : {
            inviteByMobile: this.state.invitationByMobileManual,
            inviteByName: this.state.invitationByUserNameManual,
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

  onCheckInOut = (event) => {
    event.preventDefault();

    const { roomChecked, inviteNumberExists, invitationByMobileUser } =
      this.handleCheckInOptions();

    const ratingValue =
      this.state.ratingValue === 0 && this.props.rating > 0
        ? this.props.rating
        : this.state.ratingValue;

    this.props.doCheckInOut(
      event.target.value,
      roomChecked,
      inviteNumberExists,
      invitationByMobileUser,
      ratingValue,
      this.state.commentText
    );
  };

  onGirlsRoom = (event) => {
    this.setState({ girlsRoomChecked: event.target.checked });
  };

  onInvitation = (event) => {
    this.setState({ invitationChecked: event.target.checked });
  };

  onPrivateRoom = (event) => {
    this.setState({ privateRoomChecked: event.target.checked });
  };

  onTrainingRoom = (event) => {
    this.setState({ trainingRoomChecked: event.target.checked });
  };

  renderCheckInOptions = () => {
    if (
      this.props.checkedOut === 'NOT_CHECKED_IN' ||
      (this.props.checkedOut === 'NOT_CHECKED_OUT' && this.state.editCheckIn)
    )
      return (
        <div className='row'>
          {this.renderCheckInTime()}
          {this.renderPrivateRoomButton()}
          {this.renderTrainingRoomButton()}
          {this.renderGirlsRoomButton()}
          {this.renderInvitationButton()}
          {this.renderInvitationCheckByMobile()}
          {this.renderInvitationByMobileManual()}
        </div>
      );
  };

  renderCheckOutOptions = () => {
    if (this.props.checkedOut === 'CHECKED_OUT' && this.state.editCheckOut)
      return <div className='row'>{this.renderCheckOutTime()}</div>;
  };

  renderCheckInButton = () => {
    if (this.props.checkedOut === 'NOT_CHECKED_IN')
      return (
        <button
          className='ui primary button stabraq-bg me-3 mt-1'
          name='checkIn'
          value='CHECK_IN'
          onClick={this.onCheckInOut}
          type='submit'
        >
          <i className='right arrow icon me-1' />
          Check In
        </button>
      );
  };

  renderCheckOutButton = () => {
    if (!this.state.editCheckIn && !this.state.editCheckOut)
      return (
        <button
          className='ui primary button stabraq-bg ms-3 mt-1'
          name='checkOut'
          value='CHECK_OUT'
          onClick={this.onCheckInOut}
          type='submit'
        >
          <i className='left arrow icon me-1' />
          Check Out
        </button>
      );
  };

  onTimePickersChange = (newTime) => {
    this.setState({ newTimePickerValue: newTime });
  };

  renderCheckInTime = () => {
    if (this.props.checkedOut === 'NOT_CHECKED_OUT' && this.state.editCheckIn)
      return (
        <div className='myOverflowUnset'>
          <ResponsiveTimePickers
            label='Edit Check In Time'
            initValue={this.props.checkInTime}
            onTimeChange={this.onTimePickersChange}
          />
        </div>
      );
  };

  renderCheckOutTime = () => {
    if (this.props.checkedOut === 'CHECKED_OUT' && this.state.editCheckOut)
      return (
        <div className='myOverflowUnset'>
          <ResponsiveTimePickers
            label='Edit Check Out Time'
            initValue={this.props.checkOutTime}
            onTimeChange={this.onTimePickersChange}
          />
        </div>
      );
  };

  renderPrivateRoomButton = () => {
    return (
      <div className='col'>
        <div className='form-check form-check-inline mt-3 me-3'>
          <input
            className='form-check-input m-2 p-3'
            type='checkbox'
            id='private-room'
            onChange={this.onPrivateRoom}
            checked={this.state.privateRoomChecked}
            disabled={
              this.state.girlsRoomChecked ||
              this.state.trainingRoomChecked ||
              this.state.invitationChecked
            }
          />
          <label className='form-check-label mt-1 p-2' htmlFor='private-room'>
            Private Room ({this.props.privateRoomRate}/hr)
          </label>
        </div>
      </div>
    );
  };

  renderTrainingRoomButton = () => {
    return (
      <div className='col'>
        <div className='form-check form-check-inline mt-3 me-3'>
          <input
            className='form-check-input m-2 p-3'
            type='checkbox'
            id='training-room'
            onChange={this.onTrainingRoom}
            checked={this.state.trainingRoomChecked}
            disabled={
              this.state.girlsRoomChecked ||
              this.state.privateRoomChecked ||
              this.state.invitationChecked
            }
          />
          <label className='form-check-label mt-1 p-2' htmlFor='training-room'>
            Training Room ({this.props.trainingRoomRate}/hr)
          </label>
        </div>
      </div>
    );
  };

  renderGirlsRoomButton = () => {
    if (
      this.props.gender === 'Female' &&
      this.props.membership === 'NOT_MEMBER'
    )
      return (
        <div>
          <div className='form-check form-check-inline mt-3 me-3'>
            <input
              className='form-check-input m-2 p-3'
              type='checkbox'
              id='girls-room'
              onChange={this.onGirlsRoom}
              checked={this.state.girlsRoomChecked}
              disabled={
                this.state.privateRoomChecked ||
                this.state.trainingRoomChecked ||
                this.state.invitationChecked
              }
            />
            <label className='form-check-label mt-1 p-2' htmlFor='girls-room'>
              Girls Room ({this.props.girlsHourRate}/hr)
            </label>
          </div>
        </div>
      );
  };

  renderInvitationButton = () => {
    if (this.props.membership === 'NOT_MEMBER')
      return (
        <div>
          <div className='form-check form-check-inline mt-3 me-3'>
            <input
              className='form-check-input m-2 p-3'
              type='checkbox'
              id='invitation'
              onChange={this.onInvitation}
              checked={this.state.invitationChecked}
              disabled={
                this.state.privateRoomChecked ||
                this.state.trainingRoomChecked ||
                this.state.girlsRoomChecked
              }
            />
            <label className='form-check-label mt-1 p-2' htmlFor='invitation'>
              Invitation
            </label>
          </div>
        </div>
      );
  };

  renderInvitationCheckByMobile = () => {
    if (this.props.membership === 'NOT_MEMBER' && this.state.invitationChecked)
      return (
        <div className='text-center'>
          <form className='ui form error'>
            <div className='ui segment'>
              <InputMobile
                value={this.state.invitationByMobile}
                label='Invitation By Mobile Number'
                icon='mobile'
                onFormChange={this.handleChange}
                errorMessage={this.state.errorMessage}
              />
              <div>{this.state.inviteNumberExists}</div>
              <div>{this.state.inviteUserName}</div>
            </div>
          </form>
        </div>
      );
  };

  renderInvitationByMobileManual = () => {
    if (
      this.props.membership === 'NOT_MEMBER' &&
      this.state.invitationChecked &&
      this.state.inviteNumberExists === 'NOT_EXISTS'
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
                  value={this.state.invitationByMobileManual}
                  onChange={this.handleChangeManual}
                />
              </div>
              <div className='col-sm-2 col-xs-12 fw-bold d-flex align-items-center'>
                Name
              </div>
              <div className='col-sm-4 col-xs-12'>
                <input
                  type='text'
                  placeholder='يفضل باللغة العربية'
                  value={this.state.invitationByUserNameManual}
                  onChange={this.handleChangeUserNameManual}
                />
              </div>
            </div>
          </form>
        </div>
      );
  };

  handleRating = (rate) => {
    this.setState({ ratingValue: rate / 20 });
  };

  renderRating = () => {
    if (this.props.checkedOut === 'NOT_CHECKED_OUT' && !this.state.editCheckIn)
      return (
        <div className='text-center'>
          <Rating
            customIcons={customIcons}
            onClick={this.handleRating}
            showTooltip
            // fillColor='#ff5500'
            fillColorArray={[
              '#e12025',
              '#f47950',
              '#fcb040',
              '#91ca61',
              '#3ab54a',
            ]}
            ratingValue={this.state.ratingValue * 20}
            initialValue={this.props.rating}
          />
        </div>
      );
  };

  renderCommentSection = () => {
    if (this.props.checkedOut === 'NOT_CHECKED_OUT' && !this.state.editCheckIn)
      return (
        <div className='text-center'>
          <textarea
            name='comment'
            id='comment'
            cols='60'
            rows='3'
            placeholder='Write comment'
            onChange={this.handleChangeComment}
          ></textarea>
        </div>
      );
  };

  renderDeleteCheckInButton = () => {
    if (this.props.checkedOut === 'NOT_CHECKED_OUT' && !this.state.editCheckIn)
      return (
        <button
          className='ui red button ms-3 mt-1'
          name='deleteCheckIn'
          value='DELETE_CHECK_IN'
          onClick={this.onDeleteCheckIn}
          type='submit'
        >
          <i className='trash alternate outline icon me-1' />
          Delete Check In
        </button>
      );
  };

  renderDeleteCheckOutButton = () => {
    if (this.props.checkedOut === 'CHECKED_OUT' && !this.state.editCheckOut)
      return (
        <button
          className='ui red button ms-3 mt-1'
          name='deleteCheckOut'
          value='DELETE_CHECK_OUT'
          onClick={this.onDeleteCheckOut}
          type='submit'
        >
          <i className='trash alternate outline icon me-1' />
          Delete Check Out
        </button>
      );
  };

  renderEditCheckInButton = () => {
    const className = !this.state.editCheckIn ? 'blue' : 'black';
    const btnText = !this.state.editCheckIn ? 'Edit Check In' : 'Cancel Edit';
    const btnIcon = !this.state.editCheckIn ? 'edit outline' : 'reply';
    if (this.props.checkedOut === 'NOT_CHECKED_OUT')
      return (
        <button
          className={`ui ${className} button ms-3 mt-1`}
          name='editCheckIn'
          value='EDIT_CHECK_IN'
          onClick={this.onEditCheckIn}
          type='submit'
        >
          <i className={`${btnIcon} icon me-1`} />
          {btnText}
        </button>
      );
  };

  renderEditCheckOutButton = () => {
    const className = !this.state.editCheckOut ? 'blue' : 'black';
    const btnText = !this.state.editCheckOut ? 'Edit Check Out' : 'Cancel Edit';
    const btnIcon = !this.state.editCheckOut ? 'edit outline' : 'reply';
    if (this.props.checkedOut === 'CHECKED_OUT')
      return (
        <button
          className={`ui ${className} button ms-3 mt-1`}
          name='editCheckOut'
          value='EDIT_CHECK_OUT'
          onClick={this.onEditCheckOut}
          type='submit'
        >
          <i className={`${btnIcon} icon me-1`} />
          {btnText}
        </button>
      );
  };

  renderUpdateCheckInButton = () => {
    if (this.props.checkedOut === 'NOT_CHECKED_OUT' && this.state.editCheckIn)
      return (
        <button
          className='ui orange button ms-3 mt-1'
          name='updateCheckIn'
          value='UPDATE_CHECK_IN'
          onClick={this.onUpdateCheckIn}
          type='submit'
        >
          <i className='edit icon me-1' />
          Update Check In
        </button>
      );
  };

  renderUpdateCheckOutButton = () => {
    if (this.props.checkedOut === 'CHECKED_OUT' && this.state.editCheckOut)
      return (
        <button
          className='ui orange button ms-3 mt-1'
          name='updateCheckOut'
          value='UPDATE_CHECK_OUT'
          onClick={this.onUpdateCheckOut}
          type='submit'
        >
          <i className='edit icon me-1' />
          Update Check Out
        </button>
      );
  };

  checkForErrors = async (mobile) => {
    this.setState({ errorMessage: await checkForMobNum(mobile) });
  };

  handleChange = async ({ target }) => {
    const mobile = target.value;
    await this.setState({ inviteNumberExists: '', inviteUserName: '' });
    await this.setState({ invitationByMobile: mobile });
    await this.checkForErrors(mobile);
    if (mobile.length === 11 && this.state.errorMessage === '') {
      await this.props.doCheckByMobile(mobile);
      await this.setState({
        inviteNumberExists: this.props.inviteNumberExists,
        inviteUserName: this.props.userName,
      });
    }
  };

  handleChangeManual = async ({ target }) => {
    const mobile = target.value;
    await this.setState({ invitationByMobileManual: mobile });
  };

  handleChangeUserNameManual = async ({ target }) => {
    const userName = target.value;
    await this.setState({ invitationByUserNameManual: userName });
  };

  handleChangeComment = async ({ target }) => {
    const comment = target.value;
    this.setState({ commentText: comment });
  };

  render() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    return (
      <div className='ui segment text-center'>
        {this.renderCheckInOptions()}
        {this.renderCheckOutOptions()}
        {this.renderRating()}
        {this.renderCommentSection()}
        {this.renderCheckInButton()}
        {this.renderCheckOutButton()}
        {this.renderEditCheckInButton()}
        {this.renderUpdateCheckInButton()}
        {this.renderDeleteCheckInButton()}
        {this.renderEditCheckOutButton()}
        {this.renderUpdateCheckOutButton()}
        {this.renderDeleteCheckOutButton()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading, mobileNumber, showCheckInOut } = state.app;
  const {
    gender,
    membership,
    checkedOut,
    rating,
    roomChecked,
    checkInTime,
    checkOutTime,
  } = state.user.valuesMatched;
  const { trainingRoomRate, privateRoomRate, sharedHourRate, girlsHourRate } =
    state.user.hoursDailyRates;
  const { inviteNumberExists } = state.user;
  const { userName } = state.user.inviteValuesMatched;
  return {
    loading,
    mobileNumber,
    showCheckInOut,
    gender,
    membership,
    checkedOut,
    rating,
    roomChecked,
    checkInTime,
    checkOutTime,
    trainingRoomRate,
    privateRoomRate,
    sharedHourRate,
    girlsHourRate,
    inviteNumberExists,
    userName,
  };
};

export default connect(mapStateToProps, {
  doCheckInOut,
  doCheckByMobile,
  doConfirmDeleteUserCheckIn,
  doConfirmDeleteUserCheckOut,
  doUpdateCheckIn,
  doUpdateCheckOut,
})(CheckInOut);
