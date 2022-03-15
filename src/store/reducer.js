import { combineReducers } from 'redux';
import community from './modules/community';
import login from './modules/login';

export default combineReducers({
  community,
  login,
});