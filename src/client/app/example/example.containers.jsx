import { connect } from 'react-redux';
import * as components from './components.jsx';
import { addTodo, toggleTodo } from './actions.jsx';

// Example containers

export const TodoList = connect(
  function mapStateToProps(state) {
    return { todos: state };
  },
  function mapDispatchToProps(dispatch) {
    return {
      addTodo: text => dispatch(addTodo(text)),
      toggleTodo: id => dispatch(toggleTodo(id))
    };
  }
)(components.TodoList);