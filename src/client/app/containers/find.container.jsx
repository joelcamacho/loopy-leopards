import { connect } from 'react-redux';
import FindPageComponent from '../components/find.component.jsx';

export default connect(
  function mapStateToProps(state) {
    return { state: state };
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch: dispatch };
  }
)(FindPageComponent);
