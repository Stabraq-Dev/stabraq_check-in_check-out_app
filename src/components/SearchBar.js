import React from 'react';

import { checkForMobNum } from '../functions/validation';
import { connect } from 'react-redux';
import {
  searchMobileNumber,
  doSearchByMobile,
  doShowMyModal,
} from '../actions';
import Fade from 'react-reveal/Fade';
import LoadingSpinner from './LoadingSpinner';
import { axiosAuth } from '../api/googleSheetsAPI';

class SearchBar extends React.Component {
  state = { mobileNumber: '', errorMessage: '' };
  componentDidMount() {
    this.mobile = new URLSearchParams(window.location.search).get('mobile');
    // http://localhost:3000/preferences/main/user/?mobile=01xxxxxxxxx
    // https://stabraq.netlify.app/preferences/main/user/?mobile=01xxxxxxxxx

    if (this.mobile) {
      this.urlSearch();
    }
  }

  componentWillUnmount() {
    this.setState({ mobileNumber: '' });
    this.props.doShowMyModal(false);
  }

  onURLSearchSet = async (mobile) => {
    this.setState({ mobileNumber: mobile });
  };

  urlSearch = async () => {
    await axiosAuth();
    await this.onURLSearchSet(this.mobile);
    await this.checkForErrors();
    await this.search();
  };

  renderError = () => {
    const error = this.state.errorMessage;

    if (error) {
      return (
        <div className='ui error message'>
          <Fade bottom collapse>
            <h4 className='ui header'>{error}</h4>
          </Fade>
        </div>
      );
    }
  };

  checkForErrors = async () => {
    this.setState({
      errorMessage: await checkForMobNum(this.state.mobileNumber),
    });
  };

  onFormChangeSet = async (e) => {
    this.setState({ mobileNumber: e.target.value });
  };

  onFormChange = async (e) => {
    this.props.searchMobileNumber(e.target.value);
    await this.onFormChangeSet(e);
    await this.checkForErrors();
  };

  onFormSubmit = async (event) => {
    event.preventDefault();
    await this.checkForErrors();
    if (this.props.loading) return;
    await this.search();
  };

  search = async () => {
    if (this.state.errorMessage) return;
    this.props.doSearchByMobile(this.state.mobileNumber);
  };

  renderSubmitButton() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }
    return (
      <button
        className='ui primary button stabraq-bg'
        onClick={this.onFormSubmit}
        type='submit'
      >
        <i className='chevron circle right icon me-1' />
        Search
      </button>
    );
  }

  render() {
    const className = `field ${this.state.errorMessage ? 'error' : ''}`;
    return (
      <div className='ui segment'>
        <form onSubmit={this.onFormSubmit} className='ui form error'>
          <div className={className}>
            <label>Search By Mobile Number</label>
            <input
              type='tel'
              name='mobile'
              value={this.state.mobileNumber}
              onChange={this.onFormChange}
              onBlur={this.onFormChange}
              maxLength={11}
              placeholder='01xxxxxxxxx'
            />
            {this.renderError()}
            <div className='mt-3 text-center'>{this.renderSubmitButton()}</div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.app.loading,
  };
};

export default connect(mapStateToProps, {
  searchMobileNumber,
  doSearchByMobile,
  doShowMyModal,
})(SearchBar);
