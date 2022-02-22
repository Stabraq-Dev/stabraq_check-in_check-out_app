import { renderError } from "./renderError";

const renderOptions = (input, options) => {
    return (
      <select {...input}>
        {options.map((o) => {
          return (
            <option key={o.key} value={o.value}>
              {o.text}
            </option>
          );
        })}
      </select>
    );
  };

  export const renderSelectOptions = ({ input, label, meta, options }) => {
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
    return (
      <div className={className}>
        <label>{label}</label>
        {renderOptions(input, options)}
        {renderError(meta)}
      </div>
    );
  };

