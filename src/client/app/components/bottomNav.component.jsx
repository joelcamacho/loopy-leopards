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
            <BottomNavigation>
              <HashRouter>
                <div>
                  <Link to="/search"> 
                    <BottomNavigationItem
                      className="bottomNavItem"
                      label="Search"
                      icon={<IconSearch />}
                    />
                  </Link>
                  <Link to="/plans"> 
                    <BottomNavigationItem
                      className="bottomNavItem"
                      label="Plans"
                      icon={<IconDateRange />}
                    />
                  </Link>
                  <Link to="/create"> 
                    <BottomNavigationItem
                      className="bottomNavItem"
                      label="Create"
                      icon={<IconAdd />}
                    />
                  </Link>
                  <Link to="/group"> 
                    <BottomNavigationItem
                      className="bottomNavItem"
                      label="Group"
                      icon={<IconGroup />}
                    />
                  </Link>
                  <Link to="/alerts"> 
                    <BottomNavigationItem
                      className="bottomNavItem"
                      label="Alerts"
                      icon={<IconInbox />}
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