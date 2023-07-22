import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Stack from '@mui/material/Stack';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { connect } from 'react-redux';
import { doSetDatePicker } from '../actions';

const ResponsiveDatePickers = ({
  label,
  onDateChange,
  doSetDatePicker,
  pickedDate,
}) => {
  useEffect(() => {
    doSetDatePicker(pickedDate);
    return () => {
      doSetDatePicker(new Date());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        <MobileDatePicker
          label={label}
          value={pickedDate}
          onChange={(newValue) => {
            doSetDatePicker(newValue);
            onDateChange(newValue.toLocaleDateString('en-US'));
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
};

const mapStateToProps = (state) => {
  const { loading, pickedDate } = state.app;
  return {
    loading,
    pickedDate,
  };
};

export default connect(mapStateToProps, { doSetDatePicker })(
  ResponsiveDatePickers
);
