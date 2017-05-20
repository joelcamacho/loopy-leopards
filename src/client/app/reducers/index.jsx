import { combineReducers } from 'redux'
import profile from './profile.reducer.jsx'
import group from './group.reducer.jsx'
import events from './events.reducer.jsx'
import event from './event.reducer.jsx'

export default combineReducers({
	profile,
	group,
	events,
	event
})