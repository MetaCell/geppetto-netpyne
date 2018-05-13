import React, { Component } from 'react';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';
import ImportCellParams from './ImportCellParams';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonMethodControlledSelectField = PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(SelectField);

export default class NetPyNECellRule extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentName: props.name,
      importCellOpen: false
    };
  };

  handleRenameChange = (event) => {
    var that = this;
    var storedValue = this.props.name;
    var newValue = event.target.value;
    this.setState({ currentName: newValue });
    this.triggerUpdate(function () {
      // Rename the population in Python
      Utils.renameKey('netParams.cellParams', storedValue, newValue, (response, newValue) => { that.renaming=false;});
      that.renaming=true;
    });

  }

  triggerUpdate(updateMethod) {
    //common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ currentName: nextProps.name});
  }
  
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
    var content = (<div>

      <TextField
        onChange={this.handleRenameChange}
        value = {this.state.currentName}
        disabled={this.renaming}
        floatingLabelText="The name of the cell rule"
        className={"netpyneField"}
        id={"cellRuleName"}
      />

      <br/>

      <div style={{marginTop: 100}}>
      <b>Conditions:</b>
      </div>
      
      <NetPyNEField id={"netParams.cellParams.conds.cellType"} >
        <PythonMethodControlledSelectField
          model={"netParams.cellParams['" + this.state.currentName + "']['conds']['cellType']"}
          method={"netpyne_geppetto.getAvailableCellTypes"}
          postProcessItems={this.postProcessMenuItems}
          multiple={true}
        />
      </NetPyNEField>
            
      <NetPyNEField id={"netParams.cellParams.conds.cellModel"} >
        <PythonMethodControlledSelectField
          model={"netParams.cellParams['" + this.state.currentName + "']['conds']['cellModel']"}
          method={"netpyne_geppetto.getAvailableCellModels"}
          postProcessItems={this.postProcessMenuItems}
          multiple={true}
        />
      </NetPyNEField>
      <br /><br />

      <NetPyNEField id={"netParams.cellParams.conds.pop"} >
        <PythonMethodControlledSelectField
          model={"netParams.cellParams['" + this.state.currentName + "']['conds']['pop']"}
          method={"netpyne_geppetto.getAvailablePops"}
          postProcessItems={this.postProcessMenuItems}
          multiple={true}
        />
      </NetPyNEField>

      <RaisedButton
        label="Sections"
        labelPosition="before"
        primary={true}
        onClick={() => this.props.selectPage("sections")}
      />
      
      <RaisedButton
        style={{marginLeft:40}}
        label="Import template"
        labelPosition="before"
        primary={true}
        onClick={() => this.setState({ importCellOpen: true })}
      />
      
      <ImportCellParams 
        name={this.state.currentName}
        open={this.state.importCellOpen} 
        onRequestClose={() => this.setState({ importCellOpen: false })}
      />
    </div>);

    return (
      <div>
        {content}
      </div>
    );
  };
};
