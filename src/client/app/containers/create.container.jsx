import { connect } from 'react-redux';
import CreatePageComponent from '../components/create.component.jsx';

export default connect(
  //App is listening to state
  function mapStateToProps(state) {
    return {};
  },

  function mapDispatchToProps(dispatch) {
    return {};
  }
)(CreatePageComponent);
