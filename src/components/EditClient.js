import React from 'react';

import { connect } from 'react-redux';
import { doGetSingleClient } from '../actions';
import history from '../history';
import EditClientForm from './EditClientForm';

class EditClient extends React.Component {
  componentDidMount() {
    this.row = new URLSearchParams(window.location.search).get('row');
    // http://localhost:3000/preferences/main/edit-client/?row=3
    // https://stabraq-logbook.netlify.app/preferences/main/edit-client/?row=3

    if (this.props.fromURL !== '/preferences/main/clients-list') {
      // this.props.doGetSingleClient(this.row);
      history.push('/preferences/main/clients-list');
    }
  }

  render() {
    const {
      mobileNumber,
      userName,
      eMailAddress,
      membership,
      expiryDate,
      remainDays,
      hoursPackage,
      registrationDateTime,
      remainingHours,
      remainingOfTenDays,
      invitations,
      rating,
      gender,
      offers,
    } = this.props;
    return (
      <div className='ui segment'>
        <EditClientForm
          row={this.row}
          initialValues={{
            username: userName,
            mobile: mobileNumber,
            gender,
            email: eMailAddress,
            membership,
            expiryDate: expiryDate.split('/').reverse().join('/'),
            remainDays,
            hoursPackages: hoursPackage,
            registrationDateTime,
            remainingHours,
            remainingOfTenDays,
            invitations,
            rating,
            offers,
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading } = state.app;
  const { fromURL } = state.auth;
  const {
    mobileNumber,
    userName,
    eMailAddress,
    membership,
    expiryDate,
    remainDays,
    hoursPackage,
    registrationDateTime,
    remainingHours,
    remainingOfTenDays,
    invitations,
    rating,
    gender,
    offers,
  } = state.user.clientStateToEdit;
  return {
    loading,
    mobileNumber,
    userName,
    eMailAddress,
    membership,
    expiryDate,
    remainDays,
    hoursPackage,
    registrationDateTime,
    remainingHours,
    remainingOfTenDays,
    invitations,
    rating,
    gender,
    offers,
    fromURL,
  };
};

export default connect(mapStateToProps, { doGetSingleClient })(EditClient);
