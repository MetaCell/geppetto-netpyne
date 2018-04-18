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
import RangeCondsComponent from './RangeConds'

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);
var PythonMethodControlledSelectField = PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(SelectField);

export default class Conditions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.postProcessMenuItems = this.postProcessMenuItems.bind(this);
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
    var content = 
      <div>
        <NetPyNEField id={"netParams.stimTargetParams.conds.pop"} >
          <PythonMethodControlledSelectField
            model={"netParams.stimTargetParams['" + this.props.name + "']['conds']['pop']"}
            method={"netpyne_geppetto.getAvailablePops"}
            postProcessItems={this.postProcessMenuItems}
            multiple={true}
          />
        </NetPyNEField>
        <NetPyNEField id={"netParams.stimTargetParams.conds.cellModel"} >
          <PythonMethodControlledSelectField
            model={"netParams.stimTargetParams['" + this.props.name + "']['conds']['cellModel']"}
            method={"netpyne_geppetto.getAvailableCellModels"}
            postProcessItems={this.postProcessMenuItems}
            multiple={true}
          />
        </NetPyNEField>
        <NetPyNEField id={"netParams.stimTargetParams.conds.cellType"} >
          <PythonMethodControlledSelectField
            model={"netParams.stimTargetParams['" + this.props.name + "']['conds']['cellType']"}
            method={"netpyne_geppetto.getAvailableCellTypes"}
            postProcessItems={this.postProcessMenuItems}
            multiple={true}
          />
        </NetPyNEField>
        <RangeCondsComponent name={this.props.name} />
        <NetPyNEField id="netParams.stimTargetParams.conds.cellList" className="listStyle">
          <PythonControlledListComponent
            model={"netParams.stimTargetParams['" + this.props.name + "']['conds']['condList']"}
          />
        </NetPyNEField>
      </div>
  
    return (
      <div>
        {content}
      </div>
    );
  }
};
