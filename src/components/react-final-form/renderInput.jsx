import { renderError } from './renderError';

export const renderInput = ({
  input,
  label,
  meta,
  placeholder,
  maxLength,
  disabled,
}) => {
  const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
  return (
    <div className={className}>
      <label>{label}</label>
      <input
        {...input}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete='off'
        disabled={disabled}
      />
      {renderError(meta)}
    </div>
  );
};
