import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Utils from '../../../Utils';
import ListComponent from '../../general/List';
import NetPyNEField from '../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class NetPyNEStimulationSource extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentName: props.name,
      sourceType: ''
    };
    this.stimSourceTypeOptions = [
      { type: 'IClamp' },
      { type: 'VClamp' },
      { type: 'SEClamp' },
      { type: 'NetStim' },
      { type: 'AlphaSynapse' }
    ];
    this.handleStimSourceTypeChange = this.handleStimSourceTypeChange.bind(this);
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.currentName != nextProps.name) {
      this.setState({ currentName: nextProps.name, sourceType: null });
    };
  };

  handleRenameChange = (event) => {
    var that = this;
    var storedValue = this.props.name;
    var newValue = event.target.value;
    this.setState({ currentName: newValue });
    this.triggerUpdate(function () {
      Utils.renameKey('netParams.stimSourceParams', storedValue, newValue, (response, newValue) => { that.renaming = false });
      that.renaming = true;
      Utils.sendPythonMessage("netpyne_geppetto.propagate_stim_source_rename", [newValue, storedValue]);
      GEPPETTO.trigger("global_refresh", newValue, storedValue, 'source')
    });
  };

  triggerUpdate(updateMethod) {
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    };
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
    var opts = this.stimSourceTypeOptions.map((option) => { return option.type });
    Utils
      .evalPythonMessage("[value == netpyne_geppetto.netParams.stimSourceParams['" + this.state.currentName + "']['type'] for value in "+JSON.stringify(opts)+"]")
      .then((responses) => {
        if (responses.constructor.name == "Array"){
          responses.forEach( (response, index) => {
            if (response && this.state.sourceType!=opts[index]) {
              this.setState({ sourceType: opts[index] })
            }
          })
        }
    });
  };

  handleStimSourceTypeChange(event, index, value) {
    Utils.execPythonMessage("netpyne_geppetto.netParams.stimSourceParams['" + this.state.currentName + "']['type'] = '" + value + "'");
    this.setState({ sourceType: value });
  };

  render() {

    if (this.state.sourceType == 'IClamp') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.del">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['del']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.dur">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['dur']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.amp">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['amp']"}
            />
          </NetPyNEField>

        </div>
      );
    } else if (this.state.sourceType == 'VClamp') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.tau1">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['tau1']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.tau2">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['tau2']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.vClampDur" className="listStyle">
            <PythonControlledListComponent
              model={"netParams.stimSourceParams['" + this.props.name + "']['dur']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.vClampAmp" className="listStyle">
            <PythonControlledListComponent
              model={"netParams.stimSourceParams['" + this.props.name + "']['amp']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.gain">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['gain']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.rstim">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['rstim']"}
            />
          </NetPyNEField>
        </div>
      );
    } else if (this.state.sourceType == 'AlphaSynapse') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.onset">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['onset']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.tau">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['tau']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.gmax">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['gmax']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.e">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['e']"}
            />
          </NetPyNEField>

        </div>
      );
    } else if (this.state.sourceType == 'NetStim') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.rate">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['rate']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimSourceParams.interval">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['interval']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.number">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['number']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.start">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['start']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.noise">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['noise']"}
            />
          </NetPyNEField>
        </div>
      );
    } 
    else if (this.state.sourceType == 'SEClamp') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.vClampDur" className="listStyle">
            <PythonControlledListComponent
              model={"netParams.stimSourceParams['" + this.props.name + "']['dur']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimSourceParams.vClampAmp" className="listStyle">
            <PythonControlledListComponent
              model={"netParams.stimSourceParams['" + this.props.name + "']['amp']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimSourceParams.rs">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['rs']"}
            />
          </NetPyNEField>

        </div>
      )
    }
    else {
      var variableContent = <div />
    };

    return (
      <div>
        <div>
          <TextField
            onChange={this.handleRenameChange}
            value={this.state.currentName}
            disabled={this.renaming}
            className={"netpyneField"}
            id={"sourceName"}
          />
          <br />

          <NetPyNEField id="netParams.stimSourceParams.type" className={"netpyneFieldNoWidth"} noStyle>
            <SelectField
              id={"stimSourceSelect"}
              floatingLabelText="stimulation type"
              value={this.state.sourceType}
              onChange={this.handleStimSourceTypeChange}
            >
              {(this.stimSourceTypeOptions != undefined) ?
                this.stimSourceTypeOptions.map(function (stimSourceTypeOption) {
                  return (<MenuItem id={stimSourceTypeOption.type+"MenuItem"} key={stimSourceTypeOption.type} value={stimSourceTypeOption.type} primaryText={stimSourceTypeOption.type} />)
                }) : null
              }
            </SelectField>
          </NetPyNEField>
        </div>
        {variableContent}
      </div>
    );
  };
};
