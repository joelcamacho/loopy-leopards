const { Map } = require('immutable')

const profileInit = Map({
  name: 'Willian Hua',
  photo: 'http://www.sheffield.com/wp-content/uploads/2013/06/placeholder.png',
  gender: 'Male',
  id: null,
  birthday: 'February 31, 2020',
  address: '369 Lexington Ave',
  city: 'New York City',
  state: 'New York',
  phone: '123-456-7890'
});

export default function profile(state = profileInit, action) {
  switch (action.type) {
    case 'UPDATE_USER':
    return state.map((v, k) => !!action.payload[k] ? action.payload[k] : v);
   	case 'RESET_USER': 
   		return Map({
  		  name: '',
  		  photo: '',
  		  gender: '',
  		  id: null,
  		  birthday: null,
  		  address: '',
  		  city: '',
  		  state: '',
  		  phone: ''
  		});
      default:
       	return state
  }
}