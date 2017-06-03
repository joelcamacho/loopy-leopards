import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    minHeight: '85vh',
    padding: '10pt',
  },
  gridList: {
    width: 727,
    overflowY: 'auto',
  },
};

const fakeEvents = [
  {
    img: 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F16579431%2F145182189853%2F1%2Foriginal.jpg?s=1e0dad5ec9b6b0bf86d48945bc23b5bd',
    name: "title01",
    date_Time: '6/2/2017 13:25:15',
    time: '13:25:15',
    date: '6/2/2017',
    description: 'Hello World!',
    address: '100 3rd Ave',
    city: 'NY',
    state: 'NY',
    phone: '6466210000',
    latitude: '',
    longitude: '',
    comments: 'Let\'s GO!!!',
    url: "www.google.com",
    creator_id: 1,
  },
  {
    img: 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F30676000%2F25399112885%2F1%2Foriginal.jpg?s=aad7d5822407c610ad5a604bc9a55a98',
    name: "title02",
    date_Time: '6/2/2017 13:25:15',
    time: '14:25:15',
    date: '6/2/2017',
    description: 'Hello World!',
    address: '100 3rd Ave',
    city: 'NY',
    state: 'NY',
    phone: '6466210000',
    latitude: '',
    longitude: '',
    comments: 'Let\'s GO!!!',
    url: "www.google.com",
    creator_id: 1,
  },
  {
    img: 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F16579431%2F145182189853%2F1%2Foriginal.jpg?s=1e0dad5ec9b6b0bf86d48945bc23b5bd',
    name: "title03",
    date_Time: '6/2/2017 13:25:15',
    time: '15:25:15',
    date: '6/2/2017',
    description: 'Hello World!',
    address: '100 3rd Ave',
    city: 'NY',
    state: 'NY',
    phone: '6466210000',
    latitude: '',
    longitude: '',
    comments: 'Let\'s GO!!!',
    url: "www.google.com",
    creator_id: 1,
  },
  {
    img: 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F30676000%2F25399112885%2F1%2Foriginal.jpg?s=aad7d5822407c610ad5a604bc9a55a98',
    name: "title04",
    date_Time: '6/2/2017 13:25:15',
    time: '16:25:15',
    date: '6/3/2017',
    description: 'Hello World!',
    address: '100 3rd Ave',
    city: 'NY',
    state: 'NY',
    phone: '6466210000',
    latitude: '',
    longitude: '',
    comments: 'Let\'s GO!!!',
    url: "www.google.com",
    creator_id: 1,
  },
  {
    img: 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F16579431%2F145182189853%2F1%2Foriginal.jpg?s=1e0dad5ec9b6b0bf86d48945bc23b5bd',
    name: "title05",
    date_Time: '6/2/2017 13:25:15',
    time: '17:25:15',
    date: '6/3/2017',
    description: 'Hello World!',
    address: '100 3rd Ave',
    city: 'NY',
    state: 'NY',
    phone: '6466210000',
    latitude: '',
    longitude: '',
    comments: 'Let\'s GO!!!',
    url: "www.google.com",
    creator_id: 1,
  }
]


export default class EventsPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  handleEventClick () {
    console.log("Hello World!")
  }

  render() {
    var date = new Date();
    console.log(date.toLocaleDateString())
    return (<div>
      <Tabs className="tabsContainer" tabItemContainerStyle={{backgroundColor: "lightslategrey", position: 'fixed', zIndex: '5'}}>
        <Tab className="tabsItem" label="Schedule" >
          <div style={styles.root}>
            <h1 style={{margin:'40 20 0 0'}}>Tody</h1>
            <GridList
              cols={1}
              padding={15}
              cellHeight={180}
              style={styles.gridList}
            >
              <Subheader>December</Subheader>
              {fakeEvents.map((event) => (
                <GridTile
                  key={event.time}
                  title={event.time}
                  subtitle={<span>by <b>{event.description}</b></span>}
                  onClick={this.handleEventClick}
                >
                  <img src={event.img} />
                </GridTile>
              ))}
            </GridList>
          </div>
          
        </Tab>
        <Tab className="tabsItem" label="All Plans" >
          <div style={styles.root}>
            <h1 style={{margin:'40 20 0 0'}}>Tody</h1>
            <GridList
              cols={1}
              padding={15}
              cellHeight={180}
              style={styles.gridList}

            >
              <Subheader>December</Subheader>
              {fakeEvents.map((event) => (
                <GridTile
                  key={event.time}
                  title={event.time}
                  subtitle={<span>by <b>{event.description}</b></span>}
                  onClick={this.handleEventClick}
                  actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                >
                  <img src={event.img} />
                </GridTile>
              ))}
            </GridList>
          </div>
        </Tab>
      </Tabs>
    </div>);
  }
}

//  </Tab>
//   <Tab className="tabsItem" label="Calendar">
//     <div className="tabsPage">
//       <h2 style={styles.headline}>PUT Calendar View of Plans Here </h2>
//       <p>
//         This is a third example tab.
//       </p>
//     </div>
//   </Tab>
// </Tabs>


