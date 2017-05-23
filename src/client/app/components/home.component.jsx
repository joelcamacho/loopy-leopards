import React from 'react';
import Paper from 'material-ui/Paper';
import { Image } from 'material-ui-image'

export default class HomePageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.profile);
    return (
      <div>
        <div className="home">
          <span className="banner" style={{width: '40%'}}> 
            <Image imageStyle={{width: '100%'}} style={{display: 'flex', backgroundColor: 'clear', height: '200pt', minWidth: '100%'}} src="https://s-media-cache-ak0.pinimg.com/736x/36/d5/32/36d53249261e6551ef415e5c6f150650.jpg" />
           </span>
           <div className="banner" style={{width: '50%', padding: '0 5% 0 5%'}}> 
              <h3> Hangin' Hubs</h3>
              <p> Hangin'Hubs is a social app that lets you collaboratively discover and plan group outings with your friends. </p>
            </div>

          <a href='/#/find'>
            <Paper style={{
              background: 'url(http://greywolf-graphics.com/images/material-design-wallpaper/material-design-wallpaper-20.jpg)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'}} className="item" zDepth={2}>
              <h3> FIND PLACES AND EVENTS </h3> </Paper>
          </a>
          <a href='/#/profile'>
            <Paper style={{
              background: 'url(https://www.hdwallpaperhub.com/wp-content/uploads/Material/4/HD%20Material%20Design%20Wallpaper%200155-950x534.jpg)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'}}className="item" zDepth={2}> 
              <h3> VIEW PROFILE </h3> </Paper>
          </a> 
          <a href='/#/events'>
            <Paper style={{
              background: 'url(http://phandroid.s3.amazonaws.com/wp-content/uploads/2014/07/Lowpoly_Landscape.jpg)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'}}className="item" zDepth={2}> 
              <h3> YOUR PLANS </h3> </Paper>
          </a>
          <a href='/#/group'>
            <Paper style={{
              background: 'url(https://www.walldevil.com/wallpapers/w16/sunset-vector-art.jpg)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'}}className="item" zDepth={2}> 
              <h3> MANAGE GROUPS </h3> </Paper>
          </a>
        </div>
      </div>
    );
  }
}
