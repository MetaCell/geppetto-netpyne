import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledComponent(SelectField);

const styles = {
  populationCard: {
    fontSize: 24,
    margin: 10,
    width: 350,
    height: 350,
    float: 'left'
  },
  cardContent: {
  }
};

export default class NetPyNESection extends React.Component {

  constructor(props) {
    super(props);

    var _this = this;
    this.state = {
      model: props.model,
      page: 'main',
    };


    this.setPage = this.setPage.bind(this);


    // Get available population parameters
    // Utils
    //   .sendPythonMessage('tests.POP_NUMCELLS_PARAMS', [])
    //   .then(function (response) {
    //     console.log("Getting Pop Dimensions Parameters");
    //     console.log("Response", response)
    //     _this.setState({ 'popDimensionsOptions': response });
    //   });

  }

  setPage(page) {
    this.setState({ page: page });
  }


  componentWillReceiveProps(nextProps) {
    this.setState({ model: nextProps.model });
  }

  render() {


    if (this.state.page == 'main') {
      var content = (<div>
        <TextField
          value={this.state.model.name}
          floatingLabelText="The name of the section"
        /><br />
        Geometries:<br />
        <PythonControlledTextField
          floatingLabelText="Diameter"
          requirement={this.props.requirement}
          model={"netParams.cellParams['" + this.props.path + "']['secs']['" + this.state.model.name + "']['geom']['diam']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="L"
          requirement={this.props.requirement}
          model={"netParams.cellParams['" + this.props.path + "']['secs']['" + this.state.model.name + "']['geom']['L']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="Ra"
          requirement={this.props.requirement}
          model={"netParams.cellParams['" + this.props.path + "']['secs']['" + this.state.model.name + "']['geom']['Ra']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="Pt3d"
          requirement={this.props.requirement}
          model={"netParams.cellParams['" + this.props.path + "']['secs']['" + this.state.model.name + "']['geom']['pt3d']"} />
        <br />
        Topology:<br />
        <PythonControlledTextField
          floatingLabelText="Parent Section"
          requirement={this.props.requirement}
          model={"netParams.cellParams['" + this.props.path + "']['secs']['" + this.state.model.name + "']['topol']['parentSec']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="Parent x"
          requirement={this.props.requirement}
          model={"netParams.cellParams['" + this.props.path + "']['secs']['" + this.state.model.name + "']['topol']['parentX']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="Child x"
          requirement={this.props.requirement}
          model={"netParams.cellParams['" + this.props.path + "']['secs']['" + this.state.model.name + "']['topol']['childX']"} />
        <br />
        Mechanisms:<br />
        Ions:<br />

      </div>);
    }
   
    // topol: Dictionary with topology properties.
    // Includes parentSec (label of parent section), parentX (parent location where to make connection) and childX (current section –child– location where to make connection).

    // mechs: Dictionary of density/distributed mechanisms.
    // The key contains the name of the mechanism (e.g. hh or pas) The value contains a dictionary with the properties of the mechanism (e.g. {'g': 0.003, 'e': -70}).

    // ions: Dictionary of ions.
    // The key contains the name of the ion (e.g. na or k) The value contains a dictionary with the properties of the ion (e.g. {'e': -70}).

    // pointps: Dictionary of point processes (excluding synaptic mechanisms).
    // The key contains an arbitrary label (e.g. ‘Izhi’) The value contains a dictionary with the point process properties (e.g. {'mod':'Izhi2007a', 'a':0.03, 'b':-2, 'c':-50, 'd':100, 'celltype':1}).

    // Apart from internal point process variables, the following properties can be specified for each point process:

    // mod,the name of the NEURON mechanism, e.g. 'Izhi2007a'
    // loc, section location where to place synaptic mechanism, e.g. 1.0, default=0.5.
    // vref (optional), internal mechanism variable containing the cell membrane voltage, e.g. 'V'.
    // synList (optional), list of internal mechanism synaptic mechanism labels, e.g. [‘AMPA’, ‘NMDA’, ‘GABAB’]
    // vinit - (optional) Initial membrane voltage (in mV) of the section (default: -65)

    // e.g. cellRule['secs']['soma']['vinit'] = -72

    // spikeGenLoc - (optional) Indicates that this section is responsible for spike generation (instead of the default ‘soma’), and provides the location (segment) where spikes are generated.
    // e.g. cellRule['secs']['axon']['spikeGenLoc'] = 1.0

    // threshold - (optional) Threshold voltage (in mV) used to detect a spike originating in this section of the cell. If omitted, defaults to netParams.defaultThreshold = 10.0
    // e.g. cellRule['secs']['soma']['threshold'] = 5.0

    return (
      <div>
        {content}
      </div>
    );
  }
}
