import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducer.jsx';
import * as containers from './containers.jsx';
//                          ^^^^^^^^^^
import { HashRouter, Route, Switch } from 'react-router-dom'

const store = createStore(reducer);

render(
  <Provider store={store}>
	<HashRouter>
		<Switch>
          <Route exact path="/home" component={containers.HomePageContainer}/>
          <Route exact path="/profile" component={containers.ProfilePageContainer}/>
          <Route exact path="/group" component={containers.GroupPageContainer}/>
          <Route exact path="/find" component={containers.FindPageContainer}/>
          <Route exact path="/events" component={containers.EventsPageContainer}/>
     	</Switch>
     </HashRouter>
  </Provider>,
  document.getElementById('app')
);