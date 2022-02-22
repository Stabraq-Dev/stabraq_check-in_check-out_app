export const renderError = ({ error, touched }) => {
  if (touched && error) {
    return (
      <div className='ui error message'>
        <h4 className='ui header'>{error}</h4>
      </div>
    );
  }
};
