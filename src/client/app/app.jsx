import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom'

// import reducers
import reducer from './reducers/index.jsx';

// import components
import NavComponent from './components/nav.component.jsx';

// import containers
import HomePageContainer from './containers/home.container.jsx';
import ProfilePageContainer from './containers/profile.container.jsx';
import GroupPageContainer from './containers/group.container.jsx';
import FindPageContainer from './containers/find.container.jsx';
import EventsPageContainer from './containers/events.container.jsx';

// Create store using reducer
const store = createStore(reducer);

class App extends React.Component {
  constructor(props) {
    super(props);
	  // <button onClick={() => store.dispatch({
	  // 	type: 'UPDATE_USER',
	  // 	payload: {name: 'billy joel'}
	  // })}> Button  </button>
  }

  render() {
  	return (
    <Provider store={store}>
	  <div>
	  <NavComponent profile={store.getState().profile} store={store} />
		<HashRouter>
			<Switch>
	          <Route exact path="/home" component={HomePageContainer}/>
	          <Route exact path="/profile" component={ProfilePageContainer}/>
	          <Route exact path="/group" component={GroupPageContainer}/>
	          <Route exact path="/find" component={FindPageContainer}/>
	          <Route exact path="/events" component={EventsPageContainer}/>
	     	</Switch>
	     </HashRouter>
      </div>
  </Provider>
  )}
}




render( <App /> , document.getElementById('app'));