const { fromJS, Map, List } = require('immutable')

const eventInit = fromJS({
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

export default function event(state = eventInit, action) {
  switch (action.type) {
    case 'MODIFY_EVENT':
      return fromJS(action.payload);
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
    case 'EVENT_DETAILS':
      return Object.assign({}, eventInit.toJS(), action.payload);
    default:
      return state
  }
}