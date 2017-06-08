const { fromJS, Map, List } = require('immutable')

const createEventInit = fromJS({
  img: '',
  title: '',
  description: '',
  address: '',
  city: '',
  state: '',
  phone: '',
  activeState: 'In progress',
  invitees: [],
});

export default function createEvent(state = createEventInit, action) {
  switch (action.type) {
    case "CREATE_EVENT":
      // return Object.assign({}, state,
      //   {status: ''}, 
      //   {img: action.payload.img},
      //   {title: action.payload.title},
      //   {phone: action.payload.phone},
      //   {address: action.payload.address},
      //   {city :action.payload.city},
      //   {state: action.payload.state},
      //   {latitude: action.payload.latitude},
      //   {longitude: action.payload.longitude},
      //   {description: action.payload.description},
      //   {date_time: action.payload.date_time},
      //   {url: action.payload.url},
      //   {venue_id: action.payload.venue_id},
      // );
      return fromJS(action.payload);
    case "SET_STATE_BACK_TO_DEFAULT":
      return Object.assign({}, eventInit.toJS(), action.payload);
    default:
      return state
  }
}