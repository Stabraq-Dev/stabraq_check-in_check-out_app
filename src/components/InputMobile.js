import React, { Component } from 'react';
import Fade from 'react-reveal/Fade';

export class InputMobile extends Component {
  renderError = () => {
    const error = this.props.errorMessage;

    if (error) {
      return (
        <div className='ui error message'>
          <Fade bottom collapse>
            <h4 className='ui header'>{error}</h4>
          </Fade>
        </div>
      );
    }
  };

  render() {
    const { value, label, onFormChange, errorMessage } = this.props;
    const className = `field ${errorMessage ? 'error' : ''}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input
          type='tel'
          name='mobile'
          value={value}
          onChange={onFormChange}
          onBlur={onFormChange}
          maxLength={11}
          placeholder='01xxxxxxxxx'
        />
        {this.renderError()}
      </div>
    );
  }
}

export default InputMobile;
