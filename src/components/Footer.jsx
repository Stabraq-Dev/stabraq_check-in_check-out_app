import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

const Footer = () => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => tick(), 1000);
    return () => {
      clearInterval(interval);
    };
  });

  const tick = () => {
    const userLocal = localStorage.getItem('user');
    const { user } =
      userLocal !== null
        ? JSON.parse(userLocal)
        : { user: Date.now(), userId: '' };
    const remainTimeToLogout = user - Date.now();

    setTime(remainTimeToLogout);
  };
  const remainTimeToLogout = new Date(time).toISOString().substring(11, 19);
  return (
    <div>
      <div className='ui segment'>
        <div className='ui center aligned header'>
          <div className='row'>
            <div className='col-md-4 col-sm-4 col-xs-12 d-flex align-items-center justify-content-center'>
              <img
                className='mx-auto d-block'
                style={{ width: '50px', height: '50px' }}
                src='/logo.png'
                alt='Logo'
              />
            </div>
            <div className='col-md-4 col-sm-4 col-xs-12 d-flex align-items-center justify-content-center'>
              &copy; 2022 Stabraq, Inc
            </div>
            <div className='col-md-4 col-sm-4 col-xs-12 d-flex align-items-center justify-content-center'>
              <div className='row mt-3 mb-3'>
                <div className='col-4 d-flex align-items-center justify-content-center'>
                  <a
                    href='https://www.facebook.com/stabraqcs/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='nav-link'
                  >
                    <i className='facebook icon' />
                  </a>
                </div>
                <div className='col-4 d-flex align-items-center justify-content-center'>
                  <a
                    href='https://stabraq.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='nav-link'
                  >
                    <i className='globe icon' />
                  </a>
                </div>
                <div className='col-4 d-flex align-items-center justify-content-center'>
                  <a
                    href='mailto:Info@stabraq.com'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='nav-link'
                  >
                    <i className='envelope icon' />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {time !== 0 && <div
      className='d-flex align-items-center justify-content-center'
      >{remainTimeToLogout}</div>}
    </div>
  );
};

export default Footer;
