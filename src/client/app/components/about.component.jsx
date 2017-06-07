import React from 'react';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { Image } from 'material-ui-image'

export default class AboutPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="aboutContainer">
          <div className="aboutHeader"> About Us </div>

          <Card className="aboutCard">
            <CardTitle title="HanginHubs"expandable={false} />
            <CardText>
              Google maps lets you discover places to meet up. Eventbrite lets you find events. Facebook lets you create and manage new events. To discover and plan events, you would need to constantly switch between these apps.
            </CardText>
            <CardText>
              HanginHubs enables you to discover and plan events in a collaborative way. Instead of having one person do all of the work, the app allows you and your friends to suggest or vote on outings. Once an outing is decided on, the app lets you plan your get-together with easy scheduling, notifications, weather alerts, and expense tracking for a seamless experience.
            </CardText>
            <CardText>
              This application was created by team Loopy Leopards in Hack Reactor, New York, 7th cohort.
            </CardText>
          </Card>

          <Card className="aboutCard">
            <CardTitle title="Contact Information"expandable={false} />
            <CardText>
              Github: https://github.com/loopy-leopards/loopy-leopards
            </CardText>
            <CardText>
              Email: hanginhubs@gmail.com (not real!)
            </CardText>
            <CardText>
              Website: hanginhubs.com (not set up yet!) 
            </CardText>
          </Card>

          <div className="aboutHeader"> Developer Team </div>

          <Card className="aboutCard">
            <div className="aboutDeveloper">
              <div className="imageContainer">
                <Image 
                  imageStyle={{borderRadius: '50%'}} 
                  style={{backgroundColor: 'clear', height: '100%', width: '100%', margin: 'auto'}}
                  src={'https://avatars0.githubusercontent.com/u/17991229?v=3&s=400'}/>
              </div>
              <div className="aboutDevContainer">
                <div className="devHeader"> Name </div>
                <div> Joel Camacho </div>
                <div className="devHeader"> Role </div>
                <div> Product Owner / Backend Developer </div>
                <div className="devHeader"> Email </div>
                <div> [joels email] </div>
                <div className="devHeader"> Github </div>
                <div> https://github.com/joelcamacho </div>
              </div>
            </div>
          </Card>

          <Card className="aboutCard">
            <div className="aboutDeveloper">
              <div className="imageContainer">
                <Image 
                  imageStyle={{borderRadius: '50%'}} 
                  style={{backgroundColor: 'clear', height: '100%', width: '100%', margin: 'auto'}}
                  src={'https://avatars2.githubusercontent.com/u/2285736?v=3&s=400'}/>
              </div>
              <div className="aboutDevContainer">
                <div className="devHeader"> Name </div>
                <div> Willian Hua </div>
                <div className="devHeader"> Role </div>
                <div> Scrummaster / Full Stack Developer </div>
                <div className="devHeader"> Email </div>
                <div> huawillian@gmail.com </div>
                <div className="devHeader"> Github </div>
                <div> https://github.com/huawillian </div>
              </div>
            </div>
          </Card>

          <Card className="aboutCard">
            <div className="aboutDeveloper">
              <div className="imageContainer">
                <Image 
                  imageStyle={{borderRadius: '50%'}} 
                  style={{backgroundColor: 'clear', height: '100%', width: '100%', margin: 'auto'}}
                  src={'https://avatars3.githubusercontent.com/u/25209250?v=3&s=400'}/>
              </div>
              <div className="aboutDevContainer">
                <div className="devHeader"> Name </div>
                <div> David (Guangyu) Xu </div>
                <div className="devHeader"> Role </div>
                <div> Frontend Developer </div>
                <div className="devHeader"> Email </div>
                <div> [davids email] </div>
                <div className="devHeader"> Github </div>
                <div> https://github.com/DavidXu2017 </div>
              </div>
            </div>
          </Card>


          <div className="aboutHeader"> Tech Stack </div>
          <Card className="aboutCard">
            <CardTitle title="Tech Stack" expandable={false} />
            <CardText>
              <ul>
                <li> React </li>
                <li> Redux </li>
                <li> Webpack </li>
                <li> Babel </li>
                <li> SCSS </li>
                <li> Node </li>
                <li> Express </li>
                <li> Passport </li>
                <li> MYSQL </li>
                <li> Bookshelf </li>
                <li> Knex </li>
                <li> Google Cloud APIs </li>
                <li> Firebase </li>
                <li> Google Maps </li>
                <li> Twilio API </li>
                <li> Eventbrite API </li>
                <li> Yelp API </li>
                <li> DarkSky API </li>
              </ul>
            </CardText>
          </Card>

        </div>
      </div>
    );
  }
}