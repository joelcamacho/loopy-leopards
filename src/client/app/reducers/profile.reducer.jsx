const { Map } = require('immutable')

const profileInit = Map({
  id: null,
  first_name: null,
  last_name: null,
  google_id: null,
  email: null,
  password: null,
  address: null,
  city: null,
  state: null,
  latitude: null,
  longitude: null,
  phone: null,
  birthdate: null,
  registered: null
});

export default function profile(state = profileInit, action) {
  switch (action.type) {
    case 'UPDATE_PROFILE':
    return state.map((v, k) => !!action.payload[k] ? action.payload[k] : v);
   	case 'RESET_PROFILE': 
   		return Map({
        id: null,
        first_name: null,
        last_name: null,
        google_id: null,
        email: null,
        password: null,
        address: null,
        city: null,
        state: null,
        latitude: null,
        longitude: null,
        phone: null,
        birthdate: null,
        registered: null
      });
      default:
       	return state
  }
}