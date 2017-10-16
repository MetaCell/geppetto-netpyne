import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import IconMenu from 'material-ui/IconMenu';
import RaisedButton from 'material-ui/RaisedButton';

import NetPyNEField from '../general/NetPyNEField';

var PythonControlledCapability = require('../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);

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

export default class NetPyNECellRule extends React.Component {

  constructor(props) {
    super(props);

    var _this = this;
    this.state = {
      model: props.model,
      page: 'main'
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ model: nextProps.model });
  }

  render() {
    var that = this;
    var content = (<div>
      <TextField
        value={this.state.model.name}
        floatingLabelText="The name of the cell rule"
      /><br />
      <PythonControlledTextField
        floatingLabelText="Conditions Cell Type"
        requirement={this.props.requirement}
        model={"netParams.cellParams['" + this.state.model.name + "']['conds']['cellType']"}
      />
      <br />
      <PythonControlledTextField
        floatingLabelText="Conditions Cell Model"
        requirement={this.props.requirement}
        model={"netParams.cellParams['" + this.state.model.name + "']['conds']['cellModel']"}
      /><br /><br />
      <RaisedButton
        label="Sections"
        labelPosition="before"
        primary={true}
        onClick={() => that.props.selectPage("sections")}
      />
    </div>);

    return (
      <div>
        {content}
      </div>
    );
  }
}
