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

    return (
      <div>
        {content}
      </div>
    );
  }
}
