const { Map } = require('immutable')

const authInit = Map({
  id: null,
  displayName: null,
  gender: null,
  photo : null
});

export default function profile(state = profileInit, action) {
  switch (action.type) {
    case 'UPDATE_USER':
    return state.map((v, k) => !!action.payload[k] ? action.payload[k] : v);
    case 'RESET_USER': 
      return Map({
        id: null,
        displayName: null,
        gender: null,
        photo : null
      });
      default:
        return state
  }
}