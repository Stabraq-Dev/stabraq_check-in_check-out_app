const InputMobile = (props) => {
  const renderError = () => {
    const error = props.errorMessage;

    if (error) {
      return (
        <div className='ui error message'>
          <h4 className='ui header'>{error}</h4>
        </div>
      );
    }
  };

  const { value, label, icon, onFormChange, errorMessage } = props;
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
      {renderError()}
    </div>
  );
};

export default InputMobile;
