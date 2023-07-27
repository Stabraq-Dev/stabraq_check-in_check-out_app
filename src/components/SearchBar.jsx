import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { checkForMobNum } from '../functions/validation';
import { connect } from 'react-redux';
import {
  searchMobileNumber,
  doSearchByMobile,
  doShowMyModal,
} from '../actions';

import LoadingSpinner from './LoadingSpinner';
import { axiosAuth } from '../api/googleSheetsAPI';
import InputMobile from './InputMobile';

const SearchBar = (props) => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const mobile = new URLSearchParams(window.location.search).get('mobile');
    // http://localhost:3000/preferences/main/user/?mobile=01xxxxxxxxx
    // https://stabraq-logbook.netlify.app/preferences/main/user/?mobile=01xxxxxxxxx

    if (mobile) {
      urlSearch(mobile);
    }
    const localMobile = JSON.parse(sessionStorage.getItem('mobile'));
    if (localMobile) {
      setMobileNumber(localMobile);
    }

    return () => {
      setMobileNumber('');
      props.doShowMyModal(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onURLSearchSet = async (mobile) => {
    setMobileNumber(mobile);
  };

  const urlSearch = async (mobile) => {
    await axiosAuth(import.meta.env.VITE_SHEET_ID);
    await onURLSearchSet(mobile);
    await checkForErrors(mobile);
    await search(mobile);
  };

  const checkForErrors = async (mobile) => {
    setErrorMessage(await checkForMobNum(mobile));
  };

  const onFormChangeSet = async (e) => {
    setMobileNumber(e.target.value);
  };

  const onFormChange = async (e) => {
    if (window.location.pathname === '/preferences/main/user/check-in-out') {
      navigate('/preferences/main/user');
      props.doShowMyModal(false);
    }

    props.searchMobileNumber(e.target.value);
    await onFormChangeSet(e);
    await checkForErrors(e.target.value);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    await checkForErrors(mobileNumber);
    if (props.loading) return;
    await search(mobileNumber);
  };

  const search = async (mobile) => {
    if (errorMessage) return;
    props.doSearchByMobile(mobile);
  };

  const renderSubmitButton = () => {
    if (props.loading) {
      return <LoadingSpinner />;
    }
    return (
      <button
        className='ui primary button stabraq-bg'
        onClick={onFormSubmit}
        type='submit'
      >
        <i className='chevron circle right icon me-1' />
        Search
      </button>
    );
  };

  return (
    <>
      <div className='ui segment'>
        <form onSubmit={onFormSubmit} className='ui form error'>
          <InputMobile
            value={mobileNumber}
            label='Search By Mobile Number'
            icon='mobile alternate'
            onFormChange={onFormChange}
            errorMessage={errorMessage}
          />
          <div className='mt-3 text-center'>{renderSubmitButton()}</div>
        </form>
      </div>
      <Outlet />
    </>
  );
};

const mapStateToProps = (state) => {
  const { loading, showMyModal } = state.app;
  return {
    loading,
    showMyModal,
  };
};

export default connect(mapStateToProps, {
  searchMobileNumber,
  doSearchByMobile,
  doShowMyModal,
})(SearchBar);
