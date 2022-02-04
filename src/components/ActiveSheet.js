import React, { Component } from 'react';
import { connect } from 'react-redux';
import { doGetActiveUsersList } from '../actions';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

export class ActiveSheet extends Component {
  componentDidMount() {
    this.props.doGetActiveUsersList();
  }

  renderCountActiveUsers = () => {
    const { activeUsersList } = this.props;
    const usersText = activeUsersList.length === 1 ? 'User' : 'Users';
    if (activeUsersList.length > 0)
      return (
        <div className='ui segment'>
          <div className='ui center aligned header'>
            Active {usersText}: {activeUsersList.length} {usersText}
          </div>
        </div>
      );
  };

  renderList = () => {
    if (this.props.activeUsersList.length === 0) {
      return (
        <div className='ui segment'>
          <div className='ui center aligned header'>No Active Users</div>
        </div>
      );
    }
    return this.props.activeUsersList.map((active, index) => {
      return (
        <div className='item' key={index}>
          {this.renderSearch(active[1])}
          <i className='middle aligned icon'>
            {(index + 1).toString().padStart(2, '0')}
          </i>
          <i className='large middle aligned icon user circle'></i>
          <div className='content'>
            <div className='header'>{active[0]}</div>
            <div className='description'>{active[3]}</div>
          </div>
        </div>
      );
    });
  };

  renderSearch(mobile) {
    return (
      <div className='right floated content'>
        <Link
          to={`/preferences/main/user/?mobile=${mobile}`}
          className='ui button positive'
        >
          Search
        </Link>
      </div>
    );
  }

  render() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }
    return (
      <>
        {this.renderCountActiveUsers()}
        <div className='ui celled list'>{this.renderList()}</div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading } = state.app;
  const { activeUsersList } = state.user;
  return {
    loading,
    activeUsersList,
  };
};

export default connect(mapStateToProps, { doGetActiveUsersList })(ActiveSheet);
