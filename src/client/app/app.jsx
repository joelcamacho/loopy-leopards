import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom'
import reducer from './reducer.jsx';
import * as containers from './containers.jsx';
import NavComponent from './components/nav.component.jsx';
import HomePageContainer from './containers/home.container.jsx';
import ProfilePageContainer from './containers/profile.container.jsx';
import GroupPageContainer from './containers/group.container.jsx';
import FindPageContainer from './containers/find.container.jsx';
import EventsPageContainer from './containers/events.container.jsx';

const store = createStore(reducer);

render(
  <Provider store={store}>
	  <div>
	  <NavComponent state={store} />
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
  </Provider>,
  document.getElementById('app')
);