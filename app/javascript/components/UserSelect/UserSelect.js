import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AsyncSelect from 'react-select/async';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';

import UsersRepository from 'repositories/UsersRepository';

import useStyles from './styles';

const UserSelect = ({ error, label, isClearable, isDisabled, isRequired, onChange, value, helperText }) => {
  const [isFocused, setFocus] = useState(false);
  const styles = useStyles();
  const handleLoadOptions = (inputValue) =>
    UsersRepository.index({ q: { firstNameOrLastNameCont: inputValue } }).then(({ data }) => data.items);

  return (
    <FormControl margin="dense" disabled={isDisabled} focused={isFocused} error={error} required={isRequired}>
      <InputLabel shrink>{label}</InputLabel>
      <div className={styles.select}>
        <AsyncSelect
          cacheOptions
          loadOptions={handleLoadOptions}
          defaultOptions
          getOptionLabel={(user) => `${user.firstName} ${user.lastName}`}
          getOptionValue={(user) => user.id}
          isDisabled={isDisabled}
          isClearable={isClearable}
          defaultValue={value}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      </div>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

UserSelect.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape(),
  helperText: PropTypes.string,
  error: PropTypes.bool,
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
};
UserSelect.defaultProps = {
  value: null,
  helperText: '',
  error: false,
  isClearable: false,
  isDisabled: false,
  isRequired: false,
};

export default UserSelect;
