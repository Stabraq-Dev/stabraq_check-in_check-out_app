import React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Stack from '@mui/material/Stack';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileTimePicker from '@mui/lab/MobileTimePicker';

export default function ResponsiveTimePickers({
  label,
  initValue,
  onTimeChange,
}) {
  const [value, setValue] = React.useState(
    new Date(`${new Date().toLocaleDateString('en-US')} ${initValue}`)
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        <MobileTimePicker
          openTo='minutes'
          views={['hours', 'minutes', 'seconds']}
          inputFormat='hh:mm:ss a'
          label={label}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            onTimeChange(newValue.toLocaleTimeString());
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}
