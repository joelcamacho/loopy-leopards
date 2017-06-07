import React from 'react';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconSearch from 'material-ui/svg-icons/action/search';
import IconDateRange from 'material-ui/svg-icons/action/date-range';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconGroup from 'material-ui/svg-icons/social/group';
import IconInbox from 'material-ui/svg-icons/content/inbox';
import { HashRouter, Router, Link } from 'react-router-dom'


export default class BottomNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="bottomNavContainer">
          <Paper className="bottomNav">
            <BottomNavigation className="bottomNavComponent">
              <HashRouter>
                <div>
                  <Link to="/search"> 
                    <BottomNavigationItem
                      className="bottomNavItem"
                      label={<div className="bottomNavLabel"> Search </div>}
                      icon={<IconSearch className="bottomNavIcon"/>}
                    />
                  </Link>
                  <Link to="/plans"> 
                    <BottomNavigationItem
                      className="bottomNavItem"
                      label={<div className="bottomNavLabel"> Plans </div>}
                      icon={<IconDateRange className="bottomNavIcon"/>}
                    />
                  </Link>
                  <Link to="/create"> 
                    <BottomNavigationItem
                      className="bottomNavItem"
                      label={<div className="bottomNavLabel"> Create </div>} 
                      icon={<IconAdd className="bottomNavIcon"/>}
                    />
                  </Link>
                  <Link to="/group"> 
                    <BottomNavigationItem
                      className="bottomNavItem"
                      label={<div className="bottomNavLabel"> Group </div>}
                      icon={<IconGroup className="bottomNavIcon"/>}
                    />
                  </Link>
                  <Link to="/alerts"> 
                    <BottomNavigationItem
                      className="bottomNavItem"
                      label={<div className="bottomNavLabel"> Alerts </div>}
                      icon={<IconInbox className="bottomNavIcon"/>}
                    />
                  </Link>
                </div>
              </HashRouter>
            </BottomNavigation>
          </Paper>
        </div>
      </div>
    );
  }
}