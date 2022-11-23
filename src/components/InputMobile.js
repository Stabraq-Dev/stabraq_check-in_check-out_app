import React, { Component } from 'react';

export class InputMobile extends Component {
  renderError = () => {
    const error = this.props.errorMessage;

    if (error) {
      return (
        <div className='ui error message'>
          <h4 className='ui header'>{error}</h4>
        </div>
      );
    }
  };

  render() {
    const { value, label, icon, onFormChange, errorMessage } = this.props;
    const className = `field ${errorMessage ? 'error' : ''}`;
    return (
      <div className={className}>
        <label>
          <i className={`${icon} icon`} />
          {label}
        </label>
        <input
          type='tel'
          name='mobile'
          value={value}
          onChange={onFormChange}
          onBlur={onFormChange}
          maxLength={11}
          placeholder='01xxxxxxxxx'
          autoComplete='off'
        />
        {this.renderError()}
      </div>
    );
  }
}

export default InputMobile;
