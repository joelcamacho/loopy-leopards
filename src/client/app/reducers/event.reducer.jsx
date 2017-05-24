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


export default function event(state = eventInit, action) {
  switch (action.type) {
    case "CREATE_EVENT":
      let output = {};
      output.img = action.payload.img;
      output.title = action.payload.title;
      output.phone = action.payload.phone;
      output.address = action.payload.address;
      output.city = action.payload.city;
      output.state = action.payload.state;
      output.latitude = action.payload.latitude;
      output.longitude = action.payload.longitude;
      output.description = action.payload.description;
      output.date_time = action.payload.date_time;
      console.log(output)
      return output;
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