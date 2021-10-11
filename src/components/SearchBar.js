import React from 'react';

import { checkForMobNum } from '../functions/validation';
import { connect } from 'react-redux';
import { doSearchByMobile } from '../actions';
import LoadingSpinner from './LoadingSpinner';

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

  onURLSearchSet = async (mobile) => {
    this.setState({ mobileNumber: mobile });
  };

  urlSearch = async () => {
    await this.onURLSearchSet(this.mobile);
    this.setState({
      errorMessage: await checkForMobNum(this.state.mobileNumber),
    });
    await this.search();
  };

  renderError = () => {
    const error = this.state.errorMessage;

    if (error) {
      return (
        <div className='ui error message'>
          <div className='header'>{error}</div>
        </div>
      );
    }
  };

  onFormChangeSet = async (e) => {
    this.setState({ mobileNumber: e.target.value });
  };

  onFormChange = async (e) => {
    await this.onFormChangeSet(e);
    this.setState({
      errorMessage: await checkForMobNum(this.state.mobileNumber),
    });
  };

  onFormSubmit = async (event) => {
    event.preventDefault();
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
        Submit
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

export default connect(mapStateToProps, { doSearchByMobile })(SearchBar);
