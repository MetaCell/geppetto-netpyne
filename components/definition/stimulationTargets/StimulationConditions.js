import React, { Component } from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import ListComponent from '../../general/List';
import NetPyNEField from '../../general/NetPyNEField';
import NetPyNECoordsRange from '../../general/NetPyNECoordsRange';

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
        
        <NetPyNECoordsRange 
          name={this.props.name} 
          model={'netParams.stimTargetParams'}
          conds={"conds"}
          items={[
            {value: 'x', label:'absolute'}, 
            {value: 'xnorm', label:'normalized'}
          ]}
        />
        
        <NetPyNECoordsRange 
          name={this.props.name} 
          model={'netParams.stimTargetParams'}
          conds={"conds"}
          items={[
            {value: 'y', label:'absolute'}, 
            {value: 'ynorm', label:'normalized'}
          ]}
        />

        <NetPyNECoordsRange 
          name={this.props.name} 
          model={'netParams.stimTargetParams'}
          conds={"conds"}
          items={[
            {value: 'z', label:'absolute'}, 
            {value: 'znorm', label:'normalized'}
          ]}
        />
        
        <NetPyNEField id="netParams.stimTargetParams.conds.cellList" className="listStyle">
          <PythonControlledListComponent
            model={"netParams.stimTargetParams['" + this.props.name + "']['conds']['cellList']"}
          />
        </NetPyNEField>
      </div>
    );
    
    return content;
  };
};
