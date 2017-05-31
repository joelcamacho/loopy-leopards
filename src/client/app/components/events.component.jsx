import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

export default class EventsPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>
      <Tabs className="tabsContainer" tabItemContainerStyle={{backgroundColor: "lightslategrey"}}>
        <Tab className="tabsItem" label="Schedule" >
          <div className="tabsPage">
            <h2 style={styles.headline}>PUT UPCOMING PLANS LIST HERE and any conflicting plans </h2>
            <p>
              This is an example tab.
            </p>
            <p>
              You can put any sort of HTML or react component in here. It even keeps the component state!
            </p>
          </div>
        </Tab>
        <Tab className="tabsItem" label="All Plans" >
          <div className="tabsPage">
            <h2 style={styles.headline}>PUT ALL PLANS LIST HERE and any conflicting plans </h2>
            <p>
              This is another example tab.
            </p>
          </div>
        </Tab>
        <Tab className="tabsItem" label="Calendar">
          <div className="tabsPage">
            <h2 style={styles.headline}>PUT Calendar View of Plans Here </h2>
            <p>
              This is a third example tab.
            </p>
          </div>
        </Tab>
      </Tabs>
    </div>);
  }
}


