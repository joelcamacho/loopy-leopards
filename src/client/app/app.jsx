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

// import reducers
import reducer from './reducers/index.jsx';

// import components
import BottomNav from './components/bottomNav.component.jsx';

// import containers
import NavContainer from './containers/nav.container.jsx';
import HomePageContainer from './containers/home.container.jsx';
import ProfilePageContainer from './containers/profile.container.jsx';
import GroupPageContainer from './containers/group.container.jsx';
import FindPageContainer from './containers/find.container.jsx';
import EventsPageContainer from './containers/events.container.jsx';
import CreatePageContainer from './containers/create.container.jsx';
import AlertsPageContainer from './containers/alerts.container.jsx';
import AboutPageContainer from './containers/about.container.jsx';

// import helpers
import firebaseHelpers from './helpers/firebase.helper.jsx';
import fetchHelpers from './helpers/fetch.helper.jsx';

// import styles
import style from './styles/main.scss';

// Create store using reducer
const store = createStore(reducer);



class App extends React.Component {
  constructor(props) {
    super(props);
    // firebaseHelpers.requestPushNotificationPermissions();
    // fetchHelpers.fetchGoogleProfile().then(res => console.log(res));

    this.select = (index) => this.setState({selectedIndex: index});


    this.state = {
      selectedIndex: 0,
    };
  }

  render() {
  	return (
      <MuiThemeProvider>
        <div>
          <Provider store={store}>
        	  <div>  
          	  <NavContainer>
            		<HashRouter>
            			<Switch>
                    <Route exact path="/" component={FindPageContainer}/>
                    <Route exact path="/search" component={FindPageContainer}/>
                    <Route exact path="/group" component={GroupPageContainer}/>
                    <Route exact path="/plans" component={EventsPageContainer}/>
                    <Route exact path="/create" component={CreatePageContainer}/>
                    <Route exact path="/alerts" component={AlertsPageContainer}/>
                    <Route exact path="/profile" component={ProfilePageContainer}/>
                    <Route exact path="/about" component={AboutPageContainer}/>
            	    </Switch>
                </HashRouter>
              </NavContainer>
            </div>
          </Provider>
          <BottomNav />
        </div>
      </MuiThemeProvider>
    )
  }
}

render( <App /> , document.getElementById('app'));