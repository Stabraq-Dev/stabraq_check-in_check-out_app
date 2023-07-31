import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import EditClientForm from './EditClientForm';

const EditClient = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fromURL } = useSelector((state) => state.auth);
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
  } = useSelector((state) => state.user.clientStateToEdit);

  const row = new URLSearchParams(location.search).get('row');

  useEffect(() => {
    // http://localhost:3000/preferences/main/edit-client/?row=3
    // https://stabraq-logbook.netlify.app/preferences/main/edit-client/?row=3

    if (fromURL === null && fromURL !== '/preferences/main/clients-list') {
      navigate('/preferences/main/clients-list');
    }
  });

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

export default EditClient;
