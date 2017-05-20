let person = {
  name: 'Willian Hua',
  photo: 'http://www.sheffield.com/wp-content/uploads/2013/06/placeholder.png',
  gender: 'Male',
  id: null,
  birthday: Date.now(),
  address: '369 Lexington Ave',
  city: 'New York City',
  state: 'New York',
  phone: '123-456-7890'
};

export default function profile(state = person, action) {
  switch (action.type) {
    case 'UPDATE_USER':
     	for(let key in action.payload) {
     		state[key] = action.payload[key];
     	}
     	return Object.assign({}, state);
 	case 'RESET_USER': 
 		return {
		  name: '',
		  photo: '',
		  gender: '',
		  id: null,
		  birthday: null,
		  address: '',
		  city: '',
		  state: '',
		  phone: ''
		};   
    default:
     	return state
  }
}