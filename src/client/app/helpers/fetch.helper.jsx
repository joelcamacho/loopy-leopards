const helpers = {
  // Google Auth helpers
  fetchIsAuthenticated: () => {
    return fetch('/auth', {credentials: 'include'})
      .then(res => res.json())
  },

  fetchGoogleProfile: () => {
    return fetch('/user', {credentials: 'include'})
      .then(res => res.json())
  },

  // Eventbrite helpers
  fetchEventbriteData: (location, query) => {
    let options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      query: JSON.stringify({location: location, q: query})
    };

    return fetch('/api/eventbrite', options)
      .then(res => res.json())
      .catch(error => {
        console.log("Can not received data from Eventbrite Api: ", error)
        return error;
      })
  },

  // Yelp helpers
  fetchYelpData: (location, terms) => {
    let esc = encodeURIComponent;
    let query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
    let url = '/api/yelp?' + query;
    let params = {
      location: location,
      terms: terms
    };

    return fetch(url)
      .then(res => res.json())
      .catch(error => {
        console.log("Can not received data from Yelp Api: ", error);
        return error;
      })
  },

  // Twilio helpers
  fetchSendVerifyCodeToPhone: (phone) => {
    let options = {
      method: 'POST', 
      body: JSON.stringify({phone:phone}),
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return fetch('/api/twilio/phone', options)
      .then(res => res.json())
      .catch(error => {
        console.log(error);
        return error;
      });
  },

  // Push Notification helpers
  fetchSendRegisterFCMToken: (token) => {
    let options = {
      method: 'POST', 
      body: JSON.stringify({token:token}),
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return fetch('/api/push/register', options)
      .then(res => res.json())
      .catch(error => {
        console.log(error);
        return error;
      });
  },

  fetchSendUnRegisterFCM: () => {
    let options = {
      method: 'POST', 
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return fetch('/api/push/unregister', options)
      .then(res => res.json())
      .catch(error => {
        console.log(error);
        return error;
      });
  },

  // Google Maps helpers
  fetchCoordinatesForEvent: (event) => {
    let options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({address: event.address})
    };

    return fetch('/api/latlngMap', options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not get latlng code: ", err);
        return err;
      })
  },

  fetchAddressFromCoordinates: (position) => {
    let coords = position.coords;
    let latlng = new google.maps.LatLng(coords.latitude, coords.longitude);  
    let options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({latlngCode: {lat: coords.latitude, lng: coords.longitude}})
    };

    return fetch('/api/addressMap', options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not save event data: ", err);
        return err;
      })
      .then(res => {
        return res.results[0].formatted_address;
      });
  },

  fetchDirectionData: (address, destination) => {
    let options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({origin: address, destination: destination.address})
    };

    return fetch('/api/directionData', options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not save event data: ", err);
        return err;
      })
  },

  // User helpers
  fetchUserData: () => {
    return fetch('/api/user', {credentials: 'include'})
      .then(res => res.json())
      .catch(err => {
        console.log("can not fetch user data: ", err);
        return err;
      })
  },

  fetchUpdateUserData: (updateOptions) => {
    let options = {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateOptions)
    };

    return fetch('/api/user', options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not update user data: ", err);
        return err;
      })
  },

  // Group helpers
  fetchAllGroupsData: () => {
    return fetch('/api/groups', {credentials: 'include'})
      .then(res => res.json())
      .catch(err => {
        console.log("can not fetch groups: ", err);
        return err;
      })
  },

  fetchCreateNewGroup: (name)  => {
    let options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: name})
    };

    return fetch('/api/groups', options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not create group: ", err);
        return err;
      })
  },

  fetchCurrentGroupData: () => {
    return fetch('/api/group', {credentials: 'include'})
      .then(res => res.json())
      .catch(err => {
        console.log("can not fetch user group: ", err);
        return err;
      })
  },

  fetchLeaveCurrentGroup: () => {
    let options = {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return fetch('/api/group', options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not leave group: ", err);
        return err;
      })
  },

  // Group Invitations helpers
  fetchGroupInvitationsForCurrentUser: () => {
    return fetch('/api/group/invitations', {credentials: 'include'})
      .then(res => res.json())
      .catch(err => {
        console.log("can not fetch group invitations: ", err);
        return err;
      })
  },

  fetchSendGroupInvitationToPhone: (phone) => {
    let options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({phone: phone})
    };

    return fetch('/api/group/invitations', options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not send group invitation: ", err);
        return err;
      })
  },

  fetchAcceptGroupInvitation: (group) => {
    let options = {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({group_id: group.id})
    };

    return fetch('/api/group/invitations', options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not accept group invitation: ", err);
        return err;
      })
  },

  fetchRejectGroupInvitation: (group) => {
    let options = {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({group_id: group.id})
    };

    return fetch('/api/group/invitations', options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not reject group invitation: ", err);
        return err;
      })
  },

  // Group Requests helpers
  fetchGroupRequestsForCurrentUser: () => {
    return fetch('/api/group/requests', {credentials: 'include'})
      .then(res => res.json())
      .catch(err => {
        console.log("can not fetch group requests: ", err);
        return err;
      })
  },

  fetchSendGroupRequestToGroupName: (name) => {
    let options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: name})
    };

    return fetch('/api/group/requests', options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not send request to group: ", err);
        return err;
      })
  },

  fetchAcceptGroupRequest: (user) => {
    let options = {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({guest_id: user.id})
    };

    return fetch('/api/group/requests', options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not accept group request: ", err);
        return err;
      })
  },

  fetchRejectGroupRequest: (user) => {
    let options = {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({guest_id: user.id})
    };

    return fetch('/api/group/requests', options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not reject group requests: ", err);
        return err;
      })
  },

  // Events helpers
  fetchAllEventsForCurrentUser: () => {
    return fetch('/api/events', {credentials: 'include'})
      .then(res => res.json())
      .catch(err => {
        console.log("can not fetch events: ", err);
        return err;
      })
  },

  fetchCreateNewEvent: (name, details = {})  => {
    let eventDetails = Object.assign(details, {name: name});

    let options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventDetails)
    };

    return fetch('/api/events', options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not create event: ", err);
        return err;
      })
  },

  // Event helpers (specific events)
  fetchEventData: (event) => {
    let endpoint = '/api/events/' + event.id;

    return fetch(endpoint, {credentials: 'include'})
      .then(res => res.json())
      .catch(err => {
        console.log("can not fetch event: ", err);
        return err;
      })
  },

  fetchUpdateEventData: (event, details) => {
    let endpoint = '/api/events/' + event.id;

    let options = {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(details)
    };

    return fetch(endpoint, options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not update event: ", err);
        return err;
      })
  },

  // Event Invitations helpers (specific events)
  fetchEventInvitations: (event) => {
    let endpoint = '/api/events/' + event.id + '/invitations';

    return fetch(endpoint, {credentials: 'include'})
      .then(res => res.json())
      .catch(err => {
        console.log("can not fetch event invitations: ", err);
        return err;
      })
  },

  fetchSendEventInvitationToPhone: (event, phone) => {
    let endpoint = '/api/events/' + event.id + '/invitations';

    let options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({phone: phone})
    };

    return fetch(endpoint, options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not send event invitation: ", err);
        return err;
      })
  },

  fetchAcceptEventInvitation: (event) => {
    let endpoint = '/api/events/' + event.id + '/invitations';

    let options = {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return fetch(endpoint, options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not accept event invitation: ", err);
        return err;
      })
  },

  fetchRejectEventInvitation: (event) => {
    let endpoint = '/api/events/' + event.id + '/invitations';

    let options = {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return fetch(endpoint, options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not reject event invitation: ", err);
        return err;
      })
  },

  // Event Broadcast helpers (specific events)
  fetchSendEventBroadcast: (event, details) => {
    let endpoint = '/api/events/' + event.id + '/broadcast';

    let options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(details)
    };

    return fetch(endpoint, options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not broadcast event: ", err);
        return err;
      })
  },

  // Event Confirm helpers (specific events)
  fetchConfirmEvent: (event) => {
    let endpoint = '/api/events/' + event.id + '/confirm';

    let options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return fetch(endpoint, options)
      .then(res => res.json())
      .catch(err => {
        console.log("can not confirm event: ", err);
        return err;
      })
  }

}

export default helpers;
