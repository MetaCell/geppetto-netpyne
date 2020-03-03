import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import SelectField from '../../base/SelectField';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);

export default class NetPyNESynapse extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      currentName: props.name,
      synMechMod: '',
      errorMessage: undefined,
      errorDetails: undefined
    };
    this.synMechModOptions = [
      { mod: 'Exp2Syn' }, { mod: 'ExpSyn' } 
    ];
    this.handleSynMechModChange = this.handleSynMechModChange.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.currentName != nextProps.name){
      this.setState({ currentName: nextProps.name, synMechMod: null });      
    }
  }
  
  handleRenameChange = event => {
    var storedValue = this.props.name;
    var newValue = Utils.nameValidation(event.target.value);
    var updateCondition = this.props.renameHandler(newValue);
    var triggerCondition = Utils.handleUpdate(updateCondition, newValue, event.target.value, this, "Synapses");

    if (triggerCondition) {
      this.triggerUpdate(() => {
        // Rename the population in Python
        Utils.renameKey('netParams.synMechParams', storedValue, newValue, (response, newValue) => {
          this.renaming = false;
          GEPPETTO.trigger('synapses_change');
        });
        this.renaming = true;
        /*
         * Update layout has been inserted in the triggerUpdate since this will have to query the backend
         * So we need to delay this along with the rename, differently we will face a key issue with netpyne
         */
        this.updateLayout();
      });
    }
  }

  triggerUpdate (updateMethod) {
    // common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  }
  
  componentDidMount () {
    this.updateLayout();
  }

  updateLayout () {
    Utils
      .evalPythonMessage("[value == netpyne_geppetto.netParams.synMechParams['" + this.state.currentName + "']['mod'] for value in ['ExpSyn', 'Exp2Syn']]")
      .then(response => { 
        if (response[0]) {
          this.setState({ synMechMod: "ExpSyn" })
        } else if (response[1]) {
          this.setState({ synMechMod: "Exp2Syn" })
        } else {
          this.setState({ synMechMod: "" })
        }
      });
  }
  
  handleSynMechModChange (event) {
    Utils.execPythonMessage("netpyne_geppetto.netParams.synMechParams['" + this.state.currentName + "']['mod'] = '" + event.target.value + "'");
    this.setState({ synMechMod: event.target.value });
  }

  render () {
    var actions = [
      <Button
        variant="contained"
        color="primary"
        label={"BACK"}
        onTouchTap={() => this.setState({ errorMessage: undefined, errorDetails: undefined })}
      />
    ];
    var title = this.state.errorMessage;
    var children = this.state.errorDetails;
    var dialogPop = (this.state.errorMessage != undefined) ? <Dialog
      title={title}
      open={true}
      actions={actions}
      
      style={{ whiteSpace: "pre-wrap" }}>
      <div style={{ overflow: 'auto' }}>
        {children}
      </div>
    </Dialog> : undefined;

    if (this.state.synMechMod == '' || this.state.synMechMod == undefined) {
      var content = <div/>
    } else { 
      var content = (
        <div>
          <NetPyNEField id="netParams.synMechParams.tau1">
            <PythonControlledTextField
              model={"netParams.synMechParams['" + this.props.name + "']['tau1']"}
            />
          </NetPyNEField>
          
          {(this.state.synMechMod == "Exp2Syn") ? <div>
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
            id={"synapseModSelect"}
            value={this.state.synMechMod}
            onChange={this.handleSynMechModChange}
          >
          </SelectField>
        </NetPyNEField>
        {content}
        {dialogPop}
      </div>
    );
  }
}
