import { connect } from 'react-redux';
import HomePageComponent from '../components/home.component.jsx';

export default connect(
  function mapStateToProps(state) {
    return { state: state };
  },
  function mapDispatchToProps(dispatch) {
  	return {
  		return { dispatch: dispatch };
  	}
  }
)(HomePageComponent);