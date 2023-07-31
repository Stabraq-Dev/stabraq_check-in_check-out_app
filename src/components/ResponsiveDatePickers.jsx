import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { doSetDatePicker } from '../actions';

const ResponsiveDatePickers = ({ label, onDateChange }) => {
  const { pickedDate } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(doSetDatePicker(pickedDate));
    return () => {
      dispatch(doSetDatePicker(new Date()));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <MobileDatePicker
          label={label}
          defaultValue={dayjs(pickedDate)}
          onChange={(newValue) => {
            dispatch(doSetDatePicker(newValue));
            onDateChange(newValue);
          }}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default ResponsiveDatePickers;
