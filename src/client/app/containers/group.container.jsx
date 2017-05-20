import { connect } from 'react-redux';
import GroupPageComponent from '../components/group.component.jsx';

export default connect(
  function mapStateToProps(state) {
    return { state: state };
  },
  function mapDispatchToProps(dispatch) {
    return {dispatch: dispatch};
  }
)(GroupPageComponent);