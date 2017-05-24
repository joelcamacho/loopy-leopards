import { combineReducers } from 'redux';
import profile from './profile.reducer.jsx';
import group from './group.reducer.jsx';
import events from './events.reducer.jsx';
import event from './event.reducer.jsx';
import auth from './auth.reducer.jsx';
import {responsiveStateReducer} from 'redux-responsive';
import {responsiveDrawer} from 'material-ui-responsive-drawer';


export default combineReducers({
	profile,
	group,
	events,
	event,
  auth,
  browser: responsiveStateReducer,
  responsiveDrawer: responsiveDrawer
})