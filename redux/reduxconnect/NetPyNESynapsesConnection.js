import { connect } from 'react-redux';
import { updateCards } from '../actions/general';
import NetPyNESynapses from '../../components/definition/synapses/NetPyNESynapses';

const PythonControlledCapability = require('../../../../js/communication/geppettoJupyter/PythonControlledCapability');
const PythonControlledNetPyNESynapses = PythonControlledCapability.createPythonControlledComponent(NetPyNESynapses);

const mapStateToProps = (state, ownProps) => ({ 
  ...ownProps
});

const mapDispatchToProps = dispatch => ({ 
  updateCards: () => dispatch(updateCards),
});

export default connect(mapStateToProps, mapDispatchToProps)(PythonControlledNetPyNESynapses);