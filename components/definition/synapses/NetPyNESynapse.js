import React, { Component } from 'react';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);

export default class NetPyNESynapse extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentName: props.name,
      synMechMod: ''
    };
    this.synMechModOptions = [
      { mod: 'Exp2Syn' }, {mod: 'ExpSyn'} 
    ];
    this.handleSynMechModChange = this.handleSynMechModChange.bind(this);
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.currentName!=nextProps.name){
      this.setState({ currentName: nextProps.name, synMechMod: null});      
    };
  };
  
  handleRenameChange = (event) => {
    var that = this;
    var storedValue = this.props.name;
    var newValue = event.target.value;
    this.setState({ currentName: newValue });
    this.triggerUpdate(function () {
      // Rename the population in Python
      Utils.renameKey('netParams.synMechParams', storedValue, newValue, (response, newValue) => { that.renaming=false;});
      that.renaming=true;
    });

  }

  triggerUpdate(updateMethod) {
    //common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  };
  
  componentDidMount() {
    this.updateLayout();
  };

  componentDidUpdate(prevProps, prevState) {
      if (this.state.currentName != prevState.currentName) {
          this.updateLayout();
      };
  };
  
  updateLayout() {
    const getMod = (value) => {
      Utils
        .sendPythonMessage("'" + value + "' == netParams.synMechParams['" + this.state.currentName + "']['mod']")
        .then((response) => { if (response) {this.setState({synMechMod: value})}});
    };
    this.synMechModOptions.forEach((option) => { getMod(option.mod) });
  };
  
  handleSynMechModChange(event, index, value) {
    Utils.execPythonCommand("netpyne_geppetto.netParams.synMechParams['" + this.state.currentName + "']['mod'] = '" + value + "'");
    this.setState({ synMechMod: value });
  };

  render() {
    if (this.state.synMechMod=='' || this.state.synMechMod==undefined) {
      var content = <div/>
    }
    else { 
      var content = (
        <div>
          <NetPyNEField id="netParams.synMechParams.tau1">
            <PythonControlledTextField
              model={"netParams.synMechParams['" + this.props.name + "']['tau1']"}
            />
          </NetPyNEField>
          
          {(this.state.synMechMod=="Exp2Syn")?<div>
            <NetPyNEField id="netParams.synMechParams.tau2">
              <PythonControlledTextField
                model={"netParams.synMechParams['" + this.props.name + "']['tau2']"}
              />
            </NetPyNEField>
            </div> : null}
          
          <NetPyNEField id="netParams.synMechParams.e" >
            <PythonControlledTextField
              model={"netParams.synMechParams['" + this.props.name + "']['e']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.synMechParams.i" >
            <PythonControlledTextField
              model={"netParams.synMechParams['" + this.props.name + "']['i']"}
            />
          </NetPyNEField>
        </div>
      )
    }

    return (
      <div>
        <TextField
          id={"synapseName"}
          onChange={this.handleRenameChange}
          value = {this.state.currentName}
          disabled={this.renaming}
          className={"netpyneField"}
        />
        <br/>
        <NetPyNEField id="netParams.synMechParams.mod" className={"netpyneFieldNoWidth"} noStyle>
          <SelectField 
            value={this.state.synMechMod}
            onChange={this.handleSynMechModChange}
          >
            {(this.synMechModOptions != undefined) ?
                this.synMechModOptions.map(function (synMechModOption) {
                  return (<MenuItem key={synMechModOption.mod} value={synMechModOption.mod} primaryText={synMechModOption.mod} />)
                }) : null
            }
          </SelectField>
        </NetPyNEField>
        {content} 
      </div>
    );
  };
};
