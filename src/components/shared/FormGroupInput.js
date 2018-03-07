import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FormGroupInput extends Component {
  render() {
    const { label, id, type, placeholder, defaultValue,
            onChange, refFunc, min, max, disabled } = this.props;

    return (
      <div className="FormGroupInput form-group">
        <label htmlFor={id} className="control-label">{label}</label>
        <input
          id={id}
          type={type}
          className="form-control"
          placeholder={placeholder || `Enter ${name}...`}
          defaultValue={defaultValue}
          min={min}
          max={max}
          onChange={onChange}
          ref={refFunc}
          disabled={disabled}
        />
      </div>
    );
  }
}

FormGroupInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'number']),
  placeholder: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  refFunc: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  disabled: PropTypes.bool,
};

FormGroupInput.defaultProps = {
  type: 'text',
  placeholder: 'Enter value...',
  defaultValue: '',
  onChange: () => {},
  refFunc: () => {},
  min: 0,
  max: 99999999999999,
  disabled: false,
};

export default FormGroupInput;
