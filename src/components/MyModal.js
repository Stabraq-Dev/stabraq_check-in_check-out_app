import React from 'react';
import { Modal } from 'bootstrap';
import Bounce from 'react-reveal/Bounce';

class MyModal extends React.Component {
  componentDidMount() {
    this.myModal = new Modal(document.getElementById('exampleModal'), {});
    this.myModal.show();
  }

  renderYesButton = () => {
    const { yesAction } = this.props;
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

  render() {
    const { body, bodyBackground, closeAction } = this.props;
    return (
      <div>
        <div
          className='modal fade'
          id='exampleModal'
          tabIndex='-1'
          aria-label='exampleModalLabel'
          aria-hidden='true'
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
                {this.renderYesButton()}
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
  }
}

export default MyModal;
