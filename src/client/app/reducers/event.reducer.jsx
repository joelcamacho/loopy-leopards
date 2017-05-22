const { fromJS, Map, List } = require('immutable')

const eventInit = fromJS({
  photo: 'http://dedicatedtodlp.com/wp-content/uploads/2013/06/photopass-front.jpg',
  title: 'Disney Land Get Together!',
  date: Date.now(),
  description: 'blah blah just go',
  address: '1313 Disneyland Dr',
  city: 'Anaheim',
  state: 'CA',
  phone: '132-234-1923',
  cost: '1000',
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