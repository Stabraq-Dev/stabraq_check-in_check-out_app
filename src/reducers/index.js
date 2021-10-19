import { combineReducers } from 'redux';

import authReducer from './authReducer';
import appReducer from './appReducer';
import userReducer from './userReducer';

export default combineReducers({
  auth: authReducer,
  app: appReducer,
  user: userReducer,
});
