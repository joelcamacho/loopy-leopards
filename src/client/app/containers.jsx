import { connect } from 'react-redux';
import * as components from './components.jsx';
import { addTodo, toggleTodo } from './actions.jsx';
import HomePageComponent from './components/home.component.jsx';
import ProfilePageComponent from './components/profile.component.jsx';
import GroupPageComponent from './components/group.component.jsx';
import FindPageComponent from './components/find.component.jsx';
import EventsPageComponent from './components/events.component.jsx';


export const HomePageContainer = connect(
  function mapStateToProps(state) {
    return { state: state };
  },
  function mapDispatchToProps(dispatch) {
    return {dispatch: dispatch};
  }
)(HomePageComponent);

export const ProfilePageContainer = connect(
  function mapStateToProps(state) {
    return { state: state };
  },
  function mapDispatchToProps(dispatch) {
    return {dispatch: dispatch};
  }
)(ProfilePageComponent);

export const GroupPageContainer = connect(
  function mapStateToProps(state) {
    return { state: state };
  },
  function mapDispatchToProps(dispatch) {
    return {dispatch: dispatch};
  }
)(GroupPageComponent);

export const FindPageContainer = connect(
  function mapStateToProps(state) {
    return { state: state };
  },
  function mapDispatchToProps(dispatch) {
    return {dispatch: dispatch};
  }
)(FindPageComponent);

export const EventsPageContainer = connect(
  function mapStateToProps(state) {
    return { state: state };
  },
  function mapDispatchToProps(dispatch) {
    return {dispatch: dispatch};
  }
)(EventsPageComponent);

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