import { useState } from 'react';

const MyAlert = (props) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className='ui container mt-3 text-center'>
      <div
        className='alert alert-danger alert-dismissible align-items-center'
        role='alert'
      >
        <i className='warning circle icon' />
        {props.bodyContent}
        <button
          type='button'
          className='btn-close'
          aria-label='Close'
          onClick={() => setDismissed(true)}
        />
      </div>
    </div>
  );
};

export default MyAlert;
