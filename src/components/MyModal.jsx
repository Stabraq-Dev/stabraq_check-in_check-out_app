import { useEffect } from 'react';
import { Modal } from 'bootstrap';
import { Bounce } from 'react-awesome-reveal';

const MyModal = (props) => {
  useEffect(() => {
    const myModal = new Modal(document.getElementById('exampleModal'), {});
    myModal.show();
  }, []);

  const renderYesButton = () => {
    const { yesAction } = props;
    if (yesAction)
      return (
        <button
          type='button'
          className='btn btn-warning'
          data-bs-dismiss='modal'
          onClick={yesAction}
        >
          Yes
        </button>
      );
  };

  const { body, bodyBackground, closeAction } = props;
  return (
    <div>
      <div
        className='modal fade'
        id='exampleModal'
        tabIndex='-1'
        aria-label='exampleModalLabel'
        aria-hidden='true'
        data-bs-backdrop='static'
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <Bounce top cascade>
                <h5 className='modal-title' id='exampleModalLabel'>
                  STABRAQ COMMUNITY SPACE
                </h5>
              </Bounce>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                onClick={closeAction}
              ></button>
            </div>
            <div className={`modal-body text-center ${bodyBackground}`}>
              {body}
            </div>
            <div className='modal-footer'>
              {renderYesButton()}
              <button
                type='button'
                className='btn btn-stabraq'
                data-bs-dismiss='modal'
                onClick={closeAction}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyModal;
