import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';
import AdapterComponent from '../../general/AdapterComponent';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledAdapterComponent = PythonControlledCapability.createPythonControlledControl(AdapterComponent);

/**
 * Range Component
 */
export default class StimulationRange extends Component {

  constructor(props) {
    super(props);
      this.state = {
        currentName: props.name,
        rangeTypeX: null,
        rangeTypeY: null,
        rangeTypeZ: null
      };
      this.ranges = [
          { value: 'x', stateVariable: 'rangeTypeX' }, { value: 'xnorm', stateVariable: 'rangeTypeX' },
          { value: 'y', stateVariable: 'rangeTypeY' }, { value: 'ynorm', stateVariable: 'rangeTypeY' },
          { value: 'z', stateVariable: 'rangeTypeZ' }, { value: 'znorm', stateVariable: 'rangeTypeZ' }
      ];
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentName != prevState.currentName) {
      this.updateLayout();
    };
  };

  componentDidMount() {
    this.updateLayout();
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.currentName != nextProps.currentName) {
        this.setState({ currentName: nextProps.currentName, rangeTypeX: null, rangeTypeY: null, rangeTypeZ: null });
    };
  };

  updateLayout() {
    const getRange = (value, stateVariable) => {
      Utils
        .sendPythonMessage("'" + value + "' in netParams.stimTargetParams['" + this.state.currentName + "']['conds']")
        .then((response) => {
          if (response) {
            var newState = {};
            newState[stateVariable] = value;
            this.setState(newState);
          };
        });
    };
    this.ranges.forEach((range) => { getRange(range.value, range.stateVariable) });
  };

  render() {
    return (
      <div>
        <NetPyNEField id={"netParams.stimTargetParams.conds.x"} >
          <SelectField
            floatingLabelText="Range type"
            id={"netParams.stimTargetParams.conds." + this.state.rangeTypeX}
            value={this.state.rangeTypeX}
            onChange={(event, index, value) => this.setState({ rangeTypeX: value })}
          >
            <MenuItem key="x" value="x" primaryText="Absolute" />
            <MenuItem key="xnorm" value="xnorm" primaryText="Normalized" />
          </SelectField>
        </NetPyNEField>
        {(this.state.rangeTypeX != undefined) ?
          <div className={"netpyneRightField"}>
            <PythonControlledAdapterComponent
              model={"netParams.stimTargetParams['" + this.state.currentName + "']['conds']['" + this.state.rangeTypeX + "']"}
              convertToPython={(state) => {
                if ((state.minXAxis != undefined && state.minXAxis != "") && (state.maxXAxis != undefined && state.maxXAxis != "")) {
                  return [state.minXAxis.replace(/[^0-9.+-]/g, ''), state.maxXAxis.replace(/[^0-9.+-]/g, '')];
                }}
              }
              convertFromPython={(prevProps, prevState, value) => {
                if (value != undefined && prevProps.value != value && value != '') {
                  return { minXAxis: value[0], maxXAxis: value[1] };
                }}
              }
            >
              <TextField floatingLabelText="Min x-axis" id="minXAxis" />
              <TextField floatingLabelText="Max x-axis" id="maxXAxis" />
            </PythonControlledAdapterComponent>
          </div>
          : null
        } <br />
        
        <NetPyNEField id={"netParams.stimTargetParams.conds.y"} >
          <SelectField
            floatingLabelText="Range type"
            id={"netParams.stimTargetParams.conds." + this.state.rangeTypeY}
            value={this.state.rangeTypeY}
            onChange={(event, index, value) => this.setState({ rangeTypeY: value })}
          >
            <MenuItem key="y" value="y" primaryText="Absolute" />
            <MenuItem key="ynorm" value="ynorm" primaryText="Normalized" />
          </SelectField>
        </NetPyNEField>
        {(this.state.rangeTypeY != undefined) ?
          <div className={"netpyneRightField"}>
            <PythonControlledAdapterComponent
              model={"netParams.stimTargetParams['" + this.state.currentName + "']['conds']['" + this.state.rangeTypeY + "']"}
              convertToPython={(state) => {
                if ((state.minYAxis != undefined && state.minYAxis != "") && (state.maxYAxis != undefined && state.maxYAxis != "")) {
                  return [state.minYAxis.replace(/[^0-9.+-]/g, ''), state.maxYAxis.replace(/[^0-9.+-]/g, '')];
                }
              }}
              convertFromPython={(prevProps, prevState, value) => {
                if (value != undefined && prevProps.value != value && value != '') {
                  return { minYAxis: value[0], maxYAxis: value[1] };
                }
              }}
            >
              <TextField floatingLabelText="Min y-axis" id="minYAxis" />
              <TextField floatingLabelText="Max y-axis" id="maxYAxis" />
            </PythonControlledAdapterComponent>
          </div>
          : null
        } <br />
        
        <NetPyNEField id={"netParams.stimTargetParams.conds.z"} >
          <SelectField
            floatingLabelText="Range type"
            id={"netParams.stimTargetParams.conds." + this.state.rangeTypeZ}
            value={this.state.rangeTypeZ}
            onChange={(event, index, value) => this.setState({ rangeTypeZ: value })}
          >
            <MenuItem key="z" value="z" primaryText="Absolute" />
            <MenuItem key="znorm" value="znorm" primaryText="Normalized" />
          </SelectField>
        </NetPyNEField>
        {(this.state.rangeTypeZ != undefined) ?
          <div className={"netpyneRightField"}>
            <PythonControlledAdapterComponent
            model={"netParams.stimTargetParams['" + this.state.currentName + "']['conds']['" + this.state.rangeTypeZ + "']"}
              convertToPython={(state) => {
                if ((state.minZAxis != undefined && state.minZAxis != "") && (state.maxZAxis != undefined && state.maxZAxis != "")) {
                  return [state.minZAxis.replace(/[^0-9.+-]/g, ''), state.maxZAxis.replace(/[^0-9.+-]/g, '')];
                }
              }}
              convertFromPython={(prevProps, prevState, value) => {
                if (value != undefined && prevProps.value != value && value != '') {
                  return { minZAxis: value[0], maxZAxis: value[1] };
                }
              }}
            >
              <TextField floatingLabelText="Min z-axis" id="minZAxis" />
              <TextField floatingLabelText="Max z-axis" id="maxZAxis" />
            </PythonControlledAdapterComponent>
          </div>
          : null
        }
      </div>
    );
  };
};
