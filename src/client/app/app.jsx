import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { fromJS, Map, List } from 'immutable';

// material
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {responsiveStoreEnhancer} from 'redux-responsive';

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

// import styles
import style from './styles/main.scss';

// Create store using reducer
const store = createStore(reducer, responsiveStoreEnhancer);

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
  	return (
      <MuiThemeProvider>
        <Provider store={store}>
      	  <div>  
            <RaisedButton label="Default" />
        	  <NavComponent>
          		<HashRouter>
          			<Switch>
                  <Route exact path="/" component={HomePageContainer}/>
                  <Route exact path="/home" component={HomePageContainer}/>
                  <Route exact path="/profile" component={ProfilePageContainer}/>
                  <Route exact path="/group" component={GroupPageContainer}/>
                  <Route exact path="/find" component={FindPageContainer}/>
                  <Route exact path="/events" component={EventsPageContainer}/>
          	    </Switch>
              </HashRouter>
            </NavComponent>
          </div>
        </Provider>
      </MuiThemeProvider>
    )
  }
}




render( <App /> , document.getElementById('app'));