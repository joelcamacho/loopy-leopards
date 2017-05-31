import { connect } from 'react-redux';
import AboutPageComponent from '../components/about.component.jsx';

export default connect(
  //App is listening to state
  function mapStateToProps(state) {
    return {};
  },

  function mapDispatchToProps(dispatch) {
    return {};
  }
)(AboutPageComponent);
