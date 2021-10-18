import React from 'react';
import { Modal } from 'bootstrap';

class MyModal extends React.Component {
  componentDidMount() {
    this.myModal = new Modal(document.getElementById('exampleModal'), {});
    this.myModal.show();
  }

  render() {
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
                {/* <h5 className='modal-title' id='exampleModalLabel'>
                  Modal title
                </h5> */}
                <button
                  type='button'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                ></button>
              </div>
              <div className='modal-body text-center'>{this.props.body}</div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-stabraq'
                  data-bs-dismiss='modal'
                  onClick={this.props.closeAction}
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
