import React from 'react';
import Paper from 'material-ui/Paper';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import { Image } from 'material-ui-image';

export default class AlertsPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.alerts);

    return (
      <div>
        <div className="alertsContainer">
          <h2 className="alertsTitle"> Notifications </h2>
          { this.props.auth.id !== null ? (
            <div>
              {this.props.alerts.map(alert => {
                return (
                  <Paper className="alertsItem">
                    <ClearIcon onTouchTap={() => this.props.removeAlert(alert)} className="removeIcon" />
                    <span className="alertIcon">
                    <Image style={{height: '100pt', width: '100pt'}} src={alert.icon}/>
                    </span>
                    <div className="alertContent">
                      <h3 className="alertTitle"> {alert.title} </h3>
                      <p className="alertBody"> {alert.body} </p> 
                    </div>
                  </Paper>
                )
              })}
              {this.props.alerts.length === 0 ? (<Paper className="alertsItemNone"> No Notifications </Paper>) : null}
          </div>) 
          : (<Paper className="alertsItemNone"> Please Sign In To See Notifications </Paper>)
        }
        </div>
      </div>
    );
  }
}
