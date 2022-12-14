import React from 'react';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material';

import store from 'store';
import TaskBoard from 'containers/TaskBoard';

const theme = createTheme({
  status: {
    danger: 'red',
  },
});

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <TaskBoard />
      </React.StrictMode>
    </ThemeProvider>
  </Provider>
);

export default App;
