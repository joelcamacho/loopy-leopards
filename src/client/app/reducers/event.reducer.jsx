let event = {
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
}

export default function event(state = event, action) {
  switch (action.type) {
    case 'MODIFY_EVENT':
      for(let key in action.payload) {
        state[key] = action.payload[key];
      }
      return Object.assign({}, state);
    case 'RESET_GROUP': 
      return  {
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
      }
    default:
      return state
  }
}