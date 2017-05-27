const { fromJS, Map, List } = require('immutable')

const eventInit = fromJS({
  img: 'http://dedicatedtodlp.com/wp-content/uploads/2013/06/photopass-front.jpg',
  title: 'Disney Land Get Together!',
  date: Date.now(),
  description: 'blah blah just go',
  address: '1313 Disneyland Dr',
  latitude: '',
  longitude: '',
  city: 'Anaheim',
  state: 'CA',
  phone: '132-234-1923',
  cost: '1000',
  date_time: '',
  list: [
    {
      name: 'Doood',
      phone: 'yee'
    }
  ],
  activeState: 'In progress'
});


export default function event(state = {status: 'first'}, action) {
  switch (action.type) {
    case "CREATE_EVENT":
      return Object.assign({}, state,
        {status: ''}, 
        {img: action.payload.img},
        {title: action.payload.title},
        {phone: action.payload.phone},
        {address: action.payload.address},
        {city :action.payload.city},
        {state: action.payload.state},
        {latitude: action.payload.latitude},
        {longitude: action.payload.longitude},
        {description: action.payload.description},
        {date_time: action.payload.date_time}
      );
    case "SET_STATE_BACK_TO_DEFAULT":
      return Object.assign({}, state, {status: 'first'});
    case 'MODIFY_EVENT':
      return state.map((v, k) => !!action.payload[k] ? action.payload[k] : v);
    case 'RESET_GROUP': 
      return  fromJS({
        photo: '',
        title: '',
        date: Date.now(),
        description: '',
        address: '',
        city: '',
        state: '',
        phone: '',
        cost: '',
        list: [
          {
            name: '',
            phone: ''
          }
        ],
        activeState: null
      });
    default:
      return state
  }
}