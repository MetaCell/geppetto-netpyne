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
    this.closeImportCell = this.closeImportCell.bind(this);
    this.openImportCell = this.openImportCell.bind(this);
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
  
  closeImportCell = () => {
    this.setState({ importCellOpen: false });
  };
  
  openImportCell = () => {
    this.setState({ importCellOpen: true });
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
    var that = this;
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
      
      <NetPyNEField id={"netParams.cellParams.conds.pop"} >
        <PythonMethodControlledSelectField
          model={"netParams.cellParams['" + this.props.name + "']['conds']['pop']"}
          method={"netpyne_geppetto.getAvailablePops"}
          postProcessItems={this.postProcessMenuItems}
          multiple={true}
        />
      </NetPyNEField>
      
      <NetPyNEField id={"netParams.cellParams.conds.cellType"} >
        <PythonMethodControlledSelectField
          model={"netParams.cellParams['" + this.props.name + "']['conds']['cellType']"}
          method={"netpyne_geppetto.getAvailableCellTypes"}
          postProcessItems={this.postProcessMenuItems}
          multiple={true}
        />
      </NetPyNEField>
            
      <NetPyNEField id={"netParams.cellParams.conds.cellModel"} >
        <PythonMethodControlledSelectField
          model={"netParams.cellParams['" + this.props.name + "']['conds']['cellModel']"}
          method={"netpyne_geppetto.getAvailableCellModels"}
          postProcessItems={this.postProcessMenuItems}
          multiple={true}
        />
      </NetPyNEField>
      <br /><br />

      <RaisedButton
        label="Sections"
        labelPosition="before"
        primary={true}
        onClick={() => that.props.selectPage("sections")}
      />
      
      <RaisedButton
        style={{marginLeft:40}}
        label="Import template"
        labelPosition="before"
        primary={true}
        onClick={this.openImportCell}
      />
      
      <ImportCellParams 
        name={this.props.name}
        open={this.state.importCellOpen} 
        onRequestClose={this.closeImportCell}
      />
    </div>);

    return (
      <div>
        {content}
      </div>
    );
  };
};
