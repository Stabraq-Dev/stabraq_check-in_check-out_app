import { configureStore } from '@reduxjs/toolkit';

// import counterReducer from './countslice';
import reducers from './reducers';
const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck:false,
      serializableCheck: false,
    }),
});

export default store;
