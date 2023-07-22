import { Component } from 'react';
import { connect } from 'react-redux';

import {
  doGetActiveUsersList,
  doGetAllCheckedInUsers,
  doSetActiveSheetTitle,
} from '../actions';
import LoadingSpinner from './LoadingSpinner';

import ActiveSheet from './ActiveSheet';
import { DATA_SHEET_ACTIVE_RANGE, DATA_SHEET_ACTIVE_TITLE } from '../ranges';

export class Active extends Component {
  componentDidMount() {
    this.onStar();
  }

  onStar = async () => {
    await this.props.doSetActiveSheetTitle({
      title: DATA_SHEET_ACTIVE_TITLE,
      selectedMonth: '',
    });
    await this.props.doGetAllCheckedInUsers(DATA_SHEET_ACTIVE_RANGE);
    await this.props.doGetActiveUsersList();
  };

  render() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    return (
      <>
        <ActiveSheet />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading } = state.app;

  return {
    loading,
  };
};

export default connect(mapStateToProps, {
  doGetAllCheckedInUsers,
  doGetActiveUsersList,
  doSetActiveSheetTitle,
})(Active);
