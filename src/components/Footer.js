import React from 'react';

const Footer = () => {
  return (
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
  );
};

export default Footer;
