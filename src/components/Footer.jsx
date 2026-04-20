const Footer = () => {
  return (
    <footer className='enhanced-footer'>
      <div className='row align-items-center text-center mx-0'>
        <div className='col-md-4 col-sm-12 mb-2 mb-md-0'>
          <img src='/logo.png' alt='Stabraq logo' className='footer-logo' />
        </div>
        <div className='col-md-4 col-sm-12 footer-copyright mb-2 mb-md-0'>
          &copy; {new Date().getFullYear()} Stabraq, Inc
        </div>
        <div className='col-md-4 col-sm-12'>
          <a
            href='https://www.facebook.com/stabraqcs/'
            target='_blank'
            rel='noopener noreferrer'
            className='me-3'
            aria-label='Facebook - opens in new tab'
          >
            <i className='facebook icon' />
          </a>
          <a
            href='https://stabraq.com/'
            target='_blank'
            rel='noopener noreferrer'
            className='me-3'
            aria-label='Website - opens in new tab'
          >
            <i className='globe icon' />
          </a>
          <a
            href='mailto:Info@stabraq.com'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Email Stabraq'
          >
            <i className='envelope icon' />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
