import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
var PythonControlledCapability = require('../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);
var PythonControlledDropdown = PythonControlledCapability.createPythonControlledComponent(TextField);


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

export default class NetPyNEPopulation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      model: props.model
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    var model=this.state.model;
    model.name=event.target.value;
    this.setState({
      model: model,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      model: nextProps.model
    });
  }

  render() {
    
    
    return (
      <div>
        <TextField
          value={this.state.model.name}
          floatingLabelText="The name of your population"
          onChange={this.handleChange}
        /><br />

        <SelectField
          floatingLabelText="Cell Type"
          value={this.state.model.cellType}
          onChange={this.handleChange}
        ><br />
          <MenuItem value={1} primaryText="Hodgkin-Huxkley" />
          <MenuItem value={2} primaryText="Izhikevich" />
          <MenuItem value={3} primaryText="Integrate and fire" />
          <MenuItem value="PYR" primaryText="PYR" />
        </SelectField>
        <br />
        <SelectField
          floatingLabelText="Cell Model"
          value={this.state.model.cellModel}
          onChange={this.handleChange}
        >
          <MenuItem value="HH" primaryText="Hodgkin-Huxkley" />
          <MenuItem value={2} primaryText="Izhikevich" />
          <MenuItem value={3} primaryText="Integrate and fire" />
        </SelectField><br />

        <PythonControlledTextField                     
            floatingLabelText="Cell Model" 
            model={"netParams.popParams['" + this.state.model.name + "']['cellModel']"} />
        <br />
        <PythonControlledTextField 
            floatingLabelText="Cell Type" 
            model={"netParams.popParams['" + this.state.model.name + "']['cellType']"} />
      </div>

    );
  }
}
