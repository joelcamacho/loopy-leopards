import { combineReducers } from 'redux';
import {responsiveStateReducer} from 'redux-responsive';
import profile from './profile.reducer.jsx';
import group from './group.reducer.jsx';
import events from './events.reducer.jsx';
import event from './event.reducer.jsx';
import auth from './auth.reducer.jsx';
import searchUsers from './searchUsers.reducer.jsx';
import invitations from './invitations.reducer.jsx';
import alerts from './alerts.reducer.jsx';
import groupUsers from './groupUsers.reducer.jsx';
import allUsers from './allUsers.reducer.jsx';
import createdEvents from './createdEvents.reducer.jsx';

export default combineReducers({
	profile,
	group,
	events,
	event,
  auth,
  browser: responsiveStateReducer,
  searchUsers,
  invitations,
  alerts,
  groupUsers,
  allUsers,
  createdEvents,
})