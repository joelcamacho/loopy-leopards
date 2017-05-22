import { connect } from 'react-redux';
import HomePageComponent from '../components/home.component.jsx';

export default connect(
  function mapStateToProps(state) {
    return { profile: state.profile.toJS() };
  },
  function mapDispatchToProps(dispatch) {
  	return { dispatch: dispatch };
  }
)(HomePageComponent);