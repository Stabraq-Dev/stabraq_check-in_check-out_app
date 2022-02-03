import React, { Component } from 'react';
import { connect } from 'react-redux';
import { doGetActiveUsersList } from '../actions';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

export class ActiveSheet extends Component {
  componentDidMount() {
    this.props.doGetActiveUsersList();
  }

  renderList = () => {
    if (this.props.activeUsersList.length === 0) {
      return (
        <div className='ui segment'>
          <div className='ui center aligned header'>No Active Users</div>
        </div>
      );
    }
    return this.props.activeUsersList.map((active) => {
      return (
        <div className='item' key={active[0]}>
          {this.renderSearch(active[1])}
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
    return <div className='ui celled list'>{this.renderList()}</div>;
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
