const { fromJS, Map, List } = require('immutable')

const alertsInit = fromJS([
  {
    title: 'Kimmy J Master',
    body: 'I will take over the world! Tomorrow...',
    icon: 'https://static.seekingalpha.com/uploads/2016/4/957061_14595169907724_rId15.jpg',
    click_action: 'http://localhost:3000'
  },
  {
    title: 'Stalin',
    body: 'Eh... Yesterday...',
    icon: 'http://cdn.history.com/sites/2/2013/12/joseph-stalin-AB.jpeg',
    click_action: 'http://localhost:3000'
  },
  {
    title: 'Notification',
    body: 'Alright, here is a real notification',
    icon: 'https://www.iconfinder.com/data/icons/basic-application-vol-1/128/Material_Design-15-512.png',
    click_action: 'http://localhost:3000'
  }
]);

const emptyInit = fromJS([]);

export default function alerts(state = alertsInit, action) {
  switch (action.type) {
    case 'ADD_ALERT':
      return state.push(fromJS(action.payload));
    case 'REMOVE_ALERT':
      let idx = state.findIndex(obj => obj.get('body') === action.payload.body);
      return state.delete(idx);
    case 'RESET_ALERT': 
      return emptyInit;
    default:
      return state
  }
}