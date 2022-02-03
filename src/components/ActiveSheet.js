import React, { Component } from 'react';
import { connect } from 'react-redux';
import { doGetActiveUsersList } from '../actions';
import { Link } from 'react-router-dom';

export class ActiveSheet extends Component {
  componentDidMount() {
    this.props.doGetActiveUsersList();
  }

  renderList = () => {
    return this.props.activeUsersList.map((active) => {
      return (
        <div className='item' key={active[0]}>
          {this.renderSearch(active[1])}
          <i className='large middle aligned icon user circle'></i>
          <div className='content'>
            <div className='header'>{active[0]}</div>
            <div className='description'>{active[1]}</div>
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
    return <div className='ui celled list'>{this.renderList()}</div>;
  }
}

const mapStateToProps = (state) => {
  const { activeUsersList } = state.user;

  return {
    activeUsersList,
  };
};

export default connect(mapStateToProps, { doGetActiveUsersList })(ActiveSheet);
