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
export default class ConnectivityRange extends Component {

  constructor(props) {
    super(props);
      this.state = {
        currentName: props.name,
        currentConds: props.conds,
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
    if (this.state.currentName != prevState.currentName || this.state.currentConds != prevState.currentConds) {
      this.updateLayout();
    };
  };

  componentDidMount() {
    this.updateLayout();
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.currentName != nextProps.name || this.state.currentConds != nextProps.conds) {
        this.setState({ currentName: nextProps.name, currentConds: nextProps.conds, rangeTypeX: null, rangeTypeY: null, rangeTypeZ: null });
    };
  };

  updateLayout() {
    const getRange = (value, stateVariable) => {
      Utils
        .sendPythonMessage("'" + value + "' in netParams.connParams['" + this.state.currentName + "']['"+this.state.currentConds+"']")
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
        <NetPyNEField id={"netParams.connParams.preConds.x"} >
          <SelectField
            floatingLabelText="Range type"
            id={"netParams.connParams." + this.state.currentConds + "." + this.state.rangeTypeX}
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
              model={"netParams.connParams['" + this.state.currentName + "']['"+this.state.currentConds+"']['" + this.state.rangeTypeX + "']"}
              convertToPython={(state) => {
                if (state.minXAxis != undefined && state.maxXAxis != undefined) {
                  return [parseFloat(state.minXAxis), parseFloat(state.maxXAxis)];
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
        
        <NetPyNEField id={"netParams.connParams.preConds.y"} >
          <SelectField
            floatingLabelText="Range type"
            id={"netParams.connParams." + this.state.currentConds + "." + this.state.rangeTypeY}
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
              model={"netParams.connParams['" + this.state.currentName + "']['"+this.state.currentConds+"']['" + this.state.rangeTypeY + "']"}
              convertToPython={(state) => {
                if (state.minYAxis != undefined && state.maxYAxis != undefined) {
                  return [parseFloat(state.minYAxis), parseFloat(state.maxYAxis)];
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
        
        <NetPyNEField id={"netParams.connParams.preConds.z"} >
          <SelectField
            floatingLabelText="Range type"
            id={"netParams.connParams." + this.state.currentConds + "." + this.state.rangeTypeZ}
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
            model={"netParams.connParams['" + this.state.currentName + "']['"+this.state.currentConds+"']['" + this.state.rangeTypeZ + "']"}
              convertToPython={(state) => {
                if (state.minZAxis != undefined && state.maxZAxis != undefined) {
                  return [parseFloat(state.minZAxis), parseFloat(state.maxZAxis)];
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
