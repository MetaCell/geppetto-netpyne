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
export default class RangeComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modelName: props.modelName,
            rangeTypeX: null,
            rangeTypeY: null,
            rangeTypeZ: null
        };
        this.ranges = [
            { value: 'xRange', stateVariable: 'rangeTypeX' }, { value: 'xnormRange', stateVariable: 'rangeTypeX' },
            { value: 'yRange', stateVariable: 'rangeTypeY' }, { value: 'ynormRange', stateVariable: 'rangeTypeY' },
            { value: 'zRange', stateVariable: 'rangeTypeZ' }, { value: 'znormRange', stateVariable: 'rangeTypeZ' }
        ]
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.modelName != prevState.modelName) {
            this.updateLayout();
        }
    }

    componentDidMount() {
        this.updateLayout();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.modelName != nextProps.modelName) {
            this.setState({ model: nextProps.modelName, rangeTypeX: null, rangeTypeY: null, rangeTypeZ: null });
        }
    }

    updateLayout() {
        const getRange = (value, stateVariable) => {
            Utils
                .sendPythonMessage("'" + value + "' in netParams.popParams['" + this.state.modelName + "']")
                .then((response) => {
                    if (response) {
                        var newState = {};
                        newState[stateVariable] = value;
                        this.setState(newState)
                    }
                });
        }

        this.ranges.forEach((range) => { getRange(range.value, range.stateVariable) })
    }

    render() {

        return (
            <div>
                <NetPyNEField id={"netParams.popParams.xRange"} >
                    <SelectField
                        floatingLabelText="Range type"
                        value={this.state.rangeTypeX}
                        onChange={(event, index, value) => this.setState({ rangeTypeX: value })}
                    >
                        <MenuItem key="xRange" value="xRange" primaryText="Absolute" />
                        <MenuItem key="xnormRange" value="xnormRange" primaryText="Normalized" />
                    </SelectField>
                </NetPyNEField>
                {(this.state.rangeTypeX != undefined) ?
                    <div className={"netpyneRightField"}>
                        <PythonControlledAdapterComponent
                            model={"netParams.popParams['" + this.state.modelName + "']['" + this.state.rangeTypeX + "']"}
                            convertToPython={(state) => {
                                if (state.minXAxis != undefined && state.maxXAxis != undefined) {
                                    return [parseFloat(state.minXAxis), parseFloat(state.maxXAxis)];
                                }
                            }}
                            convertFromPython={(prevProps, prevState, value) => {
                                if (value != undefined && prevProps.value != value && value != '') {
                                    return { minXAxis: value[0], maxXAxis: value[1] };
                                }

                            }}
                        >
                            <TextField floatingLabelText="Min x-axis" id="minXAxis" />
                            <TextField floatingLabelText="Max x-axis" id="maxXAxis" />
                        </PythonControlledAdapterComponent>
                    </div>
                    : null}
                <br />
                <NetPyNEField id={"netParams.popParams.yRange"} >
                    <SelectField
                        floatingLabelText="Range type"
                        value={this.state.rangeTypeY}
                        onChange={(event, index, value) => this.setState({ rangeTypeY: value })}
                    >
                        <MenuItem key="yRange" value="yRange" primaryText="Absolute" />
                        <MenuItem key="ynormRange" value="ynormRange" primaryText="Normalized" />
                    </SelectField>
                </NetPyNEField>
                {(this.state.rangeTypeY != undefined) ?
                    <div className={"netpyneRightField"}>
                        <PythonControlledAdapterComponent
                            model={"netParams.popParams['" + this.state.modelName + "']['" + this.state.rangeTypeY + "']"}
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
                    : null}
                <br />

                <NetPyNEField id={"netParams.popParams.zRange"} >
                    <SelectField
                        floatingLabelText="Range type"
                        id={"netParams.popParams." + this.state.rangeTypeZ}
                        value={this.state.rangeTypeZ}
                        onChange={(event, index, value) => this.setState({ rangeTypeZ: value })}
                    >
                        <MenuItem key="zRange" value="zRange" primaryText="Absolute" />
                        <MenuItem key="znormRange" value="znormRange" primaryText="Normalized" />
                    </SelectField>
                </NetPyNEField>
                {(this.state.rangeTypeZ != undefined) ?
                    <div className={"netpyneRightField"}>
                        <PythonControlledAdapterComponent
                            model={"netParams.popParams['" + this.state.modelName + "']['" + this.state.rangeTypeZ + "']"}
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
                    : null}
            </div>
        )
    }
}