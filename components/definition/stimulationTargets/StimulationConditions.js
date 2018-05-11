import React, { Component } from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import ListComponent from '../../general/List';
import OneDimRange from '../../general/OneDimRange';
import NetPyNEField from '../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);
var PythonMethodControlledSelectField = PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(SelectField);

export default class StimulationConditions extends React.Component {

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
        checked={selected.indexOf(name) > -1}
        value={name}
        primaryText={name}
      />
    ));
  };
  
  render() {      
    var content = (
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
        
        <OneDimRange 
          name={this.props.name} 
          model={'netParams.stimTargetParams'}
          conds={true}
          items={[
            {value: 'xRange', label:'absolute'}, 
            {value: 'xnormRange', label:'normalized'}
          ]}
        />
        
        <OneDimRange 
          name={this.props.name} 
          model={'netParams.stimTargetParams'}
          conds={true}
          items={[
            {value: 'yRange', label:'absolute'}, 
            {value: 'ynormRange', label:'normalized'}
          ]}
        />
        
        <OneDimRange 
          name={this.props.name} 
          model={'netParams.stimTargetParams'}
          conds={true}
          items={[
            {value: 'zRange', label:'absolute'}, 
            {value: 'znormRange', label:'normalized'}
          ]}
        />
        
        <NetPyNEField id="netParams.stimTargetParams.conds.cellList" className="listStyle">
          <PythonControlledListComponent
            model={"netParams.stimTargetParams['" + this.props.name + "']['conds']['condList']"}
          />
        </NetPyNEField>
      </div>
    );
    
    return content;
  };
};
