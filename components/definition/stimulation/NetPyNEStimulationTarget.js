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
      sourceTypeNetStim: false,
    };
    this.postProcessMenuItems = this.postProcessMenuItems.bind(this);
    this.postProcessMenuItems4SynMech = this.postProcessMenuItems4SynMech.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
  };
  
  componentWillReceiveProps(nextProps) {
    if (this.state.currentName!=nextProps.name) {
      this.setState({ currentName: nextProps.name});
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

  handleSelection = (selection) => {
    Utils
      .sendPythonMessage("'NetStim' == netParams.stimSourceParams['" + selection + "']['type']")
      .then((response) => {
        this.setState({sourceTypeNetStim: response});
      });
  };
  
  postProcessMenuItems = (pythonData, selected) => {
    if (selected!=Object & selected!='') {
      this.handleSelection(selected);
    };
    return pythonData.map((name) => (
      <MenuItem
        key={name}
        value={name}
        primaryText={name}
      />
    ));
  };
  
  postProcessMenuItems4SynMech = (pythonData, selected) => {
    return pythonData.map((name) => (
      <MenuItem
        key={name}
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
            method={"netpyne_geppetto.getAvailableStimSources"}
            postProcessItems={this.postProcessMenuItems}
            multiple={false}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.stimTargetParams.conds">
          <PythonControlledTextField
            model={"netParams.stimTargetParams['" + this.props.name + "']['conditions']"}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.stimTargetParams.sec" className="listStyle">
          <PythonControlledListComponent
            model={"netParams.stimTargetParams['" + this.props.name + "']['sec']"}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.stimTargetParams.loc">
          <PythonControlledTextField
            model={"netParams.stimTargetParams['" + this.props.name + "']['loc']"}
          />
        </NetPyNEField>
      </div>);
    if (this.state.sourceTypeNetStim) {
      var extraContent = (
        <div>
        <NetPyNEField id={"netParams.stimTargetParams.synMech"} >
          <PythonMethodControlledSelectField
            model={"netParams.stimTargetParams['" + this.props.name + "']['synMech']"}
            method={"netpyne_geppetto.getAvailableSynMech"}
            postProcessItems={this.postProcessMenuItems4SynMech}
            multiple={false}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.stimTargetParams.weight" >
          <PythonControlledTextField
            model={"netParams.stimTargetParams['" + this.props.name + "']['weight']"}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.stimTargetParams.delay" >
          <PythonControlledTextField
            model={"netParams.stimTargetParams['" + this.props.name + "']['delay']"}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.stimTargetParams.synsPerConn" >
          <PythonControlledTextField
            model={"netParams.stimTargetParams['" + this.props.name + "']['synsPerConn']"}
          />
        </NetPyNEField>
        </div>
      );
    } else {
      var extraContent = (
        <div/>
      );
    }

    return (
      <div>
        {content}
        {extraContent}
      </div>
    );
  }
};
