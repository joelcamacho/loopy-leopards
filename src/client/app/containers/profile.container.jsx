import { connect } from 'react-redux';
import ProfilePageComponent from '../components/profile.component.jsx';

export default connect(
  function mapStateToProps(state) {
    return { state: state };
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch: dispatch };
  }
)(ProfilePageComponent);
