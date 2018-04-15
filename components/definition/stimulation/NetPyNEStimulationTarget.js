import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import IconMenu from 'material-ui/IconMenu';
import RaisedButton from 'material-ui/RaisedButton';
import clone from 'lodash.clone';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';
import ListComponent from '../../general/List';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(SelectField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);
var PythonMethodControlledSelectField = PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(SelectField);

export default class NetPyNEStimulationTarget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentName: props.name,
      currentSource: null
    };
  };
  
  componentWillReceiveProps(nextProps) {
    if (this.state.currentName!=nextProps.name) {
      this.setState({ currentName: nextProps.name, currentSource: null});
    };
  };
  
  handleRenameChange = (event) => {
    var that = this;
    var storedValue = this.props.name;
    var newValue = event.target.value;
    this.setState({ currentName: newValue });
    this.triggerUpdate(function () {
      // Rename the population in Python
      Utils.renameKey('netParams.stimTargetParams', storedValue, newValue, (response, newValue) => { that.renaming=false;});
      that.renaming=true;
    });
  };

  triggerUpdate(updateMethod) {
    //common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ currentName: nextProps.name});
  };

  postProcessMenuItems(pythonData, selected) {
    return pythonData.map((name) => (
      <MenuItem
        key={name}
        insetChildren={true}
        checked={selected && selected.indexOf(name) > -1}
        value={name}
        primaryText={name}
      />
    ));
  };
  
  render() {
    var content = (
      <div>
        <TextField
          onChange={this.handleRenameChange}
          value = {this.state.currentName}
          disabled={this.renaming}
          className={"netpyneField"}
          id={"targetName"}
        />
        <br/>
        <NetPyNEField id={"netParams.stimTargetParams.source"} >
          <PythonMethodControlledSelectField
            model={"netParams.stimTargetParams['" + this.props.name + "']['source']"}
            method={"netParams.stimSourceParams.keys()"}
            multiple={false}
          />
        </NetPyNEField>
      </div>);

    return (
      <div>
        {content}
      </div>
    );
  }
};
