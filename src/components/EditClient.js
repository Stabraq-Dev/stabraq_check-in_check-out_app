import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { doGetSingleClient } from '../actions';
import EditClientForm from './EditClientForm';

const EditClient = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const row = new URLSearchParams(location.search).get('row');

  useEffect(() => {
    // http://localhost:3000/preferences/main/edit-client/?row=3
    // https://stabraq-logbook.netlify.app/preferences/main/edit-client/?row=3

    if (
      props.fromURL === null &&
      props.fromURL !== '/preferences/main/clients-list'
    ) {
      // props.doGetSingleClient(row);
      navigate('/preferences/main/clients-list');
    }
  });

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
  } = props;
  return (
    <div className='ui segment'>
      <EditClientForm
        row={row}
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
};

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
