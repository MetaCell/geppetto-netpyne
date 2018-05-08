import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Utils from '../../../../../Utils';
import NetPyNEField from '../../../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonMethodControlledSelectField = PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(SelectField);

export default class NetPyNEMechanism extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentMech: props.name,
      mechFields: ''
    };
    this.findmechFields = this.findMechFields.bind(this);
    this.renderMechFields = this.renderMechFields.bind(this);
  };
  
  componentWillReceiveProps(nextProps) {
    this.setState({ currentMech: nextProps.name});
  };
  
  findMechFields = () => {
    Utils
      .sendPythonMessage("netpyne_geppetto.getMechParams", [this.state.currentMech])
      .then((response) => {
        if (JSON.stringify(this.state.mechFields)!=JSON.stringify(response))
        this.setState({mechFields: response})
      })
  };
  
  renderMechFields = () => {
    if (this.state.mechFields=='') return <div key={"empty"}/>
    var tag = "netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.section + "']['mechs']['" + this.state.currentMech + "']"
    return this.state.mechFields.map((name, i) =>
      <PythonControlledTextField name={name} key={name} model={tag + "['"+name+"']"} floatingLabelText={name} realType={"float"} style={{width:'100%'}}/>
    )
  };

  render() {
    var content = []
    if (this.state.currentMech!=undefined && this.state.currentMech!='') {
      this.findMechFields()
      content.push(this.renderMechFields())
    };
    
    return (
      <div>
        <TextField
          key="netpyneField"
          value={this.state.currentMech}
          floatingLabelText="Mechanism"
          className={"netpyneField"}
          disabled={true}
        />
        <br />
        {content}
      </div>
    );
  };
};
