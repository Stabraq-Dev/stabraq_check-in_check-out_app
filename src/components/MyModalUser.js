import React, { Component } from 'react';
import MyModal from './MyModal';
import { connect } from 'react-redux';
import { doShowMyModal } from '../actions';
import history from '../history';

export class MyModalUser extends Component {
  renderBody() {
    switch (this.props.submitType) {
      case 'ON_SEARCH_SUBMIT':
        if (this.props.numberExists === 'EXISTS') {
          return (
            <div className='text-center'>
              <h1>
                {/[\u0600-\u06FF]/.test(this.props.userName)
                  ? 'مرحبا'
                  : 'Welcome Back'}
                <br />
                {this.props.userName}
              </h1>
            </div>
          );
        } else {
          return (
            <div className='text-center'>
              <p>{this.props.numberExists}</p>
            </div>
          );
        }
      case 'ON_USER_SUBMIT':
        break;
      case 'ON_NEW_USER_SUBMIT':
        break;
      case 'ON_CHECK_IN_OUT_SUBMIT':
        if (this.props.rowNumber === 'NOT_CHECKED_IN') {
          return <div>me</div>;
        }
        break;
      default:
        return '';
    }
  }

  renderAction = () => {
    switch (this.props.numberExists) {
      case 'EXISTS':
        return history.push('/preferences/main/user/check-in-out');
      case 'NOT_EXISTS':
        return history.push('/preferences/main/new-user');
      default:
        return history.push('/');
    }
  };

  render() {
    if (this.props.showMyModal) {
      return (
        <MyModal body={this.renderBody()} closeAction={this.renderAction} />
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    showMyModal: state.app.showMyModal,
    submitType: state.app.submitType,
    numberExists: state.app.numberExists,
    userName: state.app.valuesMatched.userName,
    rowNumber: state.app.valuesMatched.rowNumber,
  };
};

export default connect(mapStateToProps, { doShowMyModal })(MyModalUser);
