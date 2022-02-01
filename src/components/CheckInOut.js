import React from 'react';
import { connect } from 'react-redux';
import { doCheckInOut, doCheckByMobile } from '../actions';
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
  };

  componentDidMount() {
    if (!this.props.showCheckInOut) {
      history.push('/preferences/main/user');
    }
  }

  onCheckInOut = (event) => {
    event.preventDefault();
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

  renderPrivateRoomButton = () => {
    if (this.props.checkedOut === 'NOT_CHECKED_IN')
      return (
        <div className='col'>
          <div className='form-check form-check-inline mt-3 me-3'>
            <input
              className='form-check-input m-2 p-3'
              type='checkbox'
              id='private-room'
              onChange={this.onPrivateRoom}
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
    if (this.props.checkedOut === 'NOT_CHECKED_IN')
      return (
        <div className='col'>
          <div className='form-check form-check-inline mt-3 me-3'>
            <input
              className='form-check-input m-2 p-3'
              type='checkbox'
              id='training-room'
              onChange={this.onTrainingRoom}
              disabled={
                this.state.girlsRoomChecked ||
                this.state.privateRoomChecked ||
                this.state.invitationChecked
              }
            />
            <label
              className='form-check-label mt-1 p-2'
              htmlFor='training-room'
            >
              Training Room ({this.props.trainingRoomRate}/hr)
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
        <div>
          <div className='form-check form-check-inline mt-3 me-3'>
            <input
              className='form-check-input m-2 p-3'
              type='checkbox'
              id='girls-room'
              onChange={this.onGirlsRoom}
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
    if (
      this.props.checkedOut === 'NOT_CHECKED_IN' &&
      this.props.membership === 'NOT_MEMBER'
    )
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
    if (
      this.props.checkedOut === 'NOT_CHECKED_IN' &&
      this.props.membership === 'NOT_MEMBER' &&
      this.state.invitationChecked
    )
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
      this.props.checkedOut === 'NOT_CHECKED_IN' &&
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
    if (this.props.checkedOut === 'NOT_CHECKED_OUT')
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
    if (this.props.checkedOut === 'NOT_CHECKED_OUT')
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
        <div className='row'>
          {this.renderPrivateRoomButton()}
          {this.renderTrainingRoomButton()}
          {this.renderGirlsRoomButton()}
          {this.renderInvitationButton()}
          {this.renderInvitationCheckByMobile()}
          {this.renderInvitationByMobileManual()}
          {this.renderRating()}
          {this.renderCommentSection()}
        </div>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading, mobileNumber, showCheckInOut } = state.app;
  const { gender, membership, checkedOut, rating } = state.user.valuesMatched;
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
    trainingRoomRate,
    privateRoomRate,
    sharedHourRate,
    girlsHourRate,
    inviteNumberExists,
    userName,
  };
};

export default connect(mapStateToProps, { doCheckInOut, doCheckByMobile })(
  CheckInOut
);
