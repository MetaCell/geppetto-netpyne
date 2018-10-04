import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Utils from '../../../Utils';

import NetPyNEField from '../../general/NetPyNEField';
var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
/**
 * Population Dimensions Component
 */
export default class DimensionsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modelName: props.modelName,
            dimension: null
        };
        this.popDimensionsOptions = [{ label: 'Number of cells', value: 'numCells' }, { label: 'Density', value: 'density' }, { label: 'Grid spacing', value: 'gridSpacing' }];

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
            this.setState({ modelName: nextProps.modelName, dimension: null });
        }
    }

    updateLayout() {
        let requests = this.popDimensionsOptions.map((popDimensionsOption) => {
            //FIXME Better to wrap calls rather than directly accessing objects
            return Utils
                .sendPythonMessage("'" + popDimensionsOption.value + "' in netpyne_geppetto.netParams.popParams['" + this.state.modelName + "']");

        });

        // Get population dimension by asking each for each key
        Promise.all(requests).then((values) => {
            var index = values.indexOf(true);
            if (index == -1) {
                this.setState({ dimension: null });
            }
            else {
                this.setState({ dimension: this.popDimensionsOptions[index].value });
            }
        });
    }

    render() {

        return (
            <div>
                <NetPyNEField id="netParams.popParams.numCells" className={"netpyneFieldNoWidth"} noStyle>
                    <SelectField
                        id={"popParamsDimensionsSelect"}
                        value={this.state.dimension}
                        onChange={(event, index, value) => this.setState({ dimension: value })}
                    >
                        {(this.popDimensionsOptions != undefined) ?
                            this.popDimensionsOptions.map(function (popDimensionsOption) {
                                return (<MenuItem id={"popParamS"+popDimensionsOption.value} key={popDimensionsOption.value} value={popDimensionsOption.value} primaryText={popDimensionsOption.label} />)
                            }) : null}
                    </SelectField>
                </NetPyNEField>
                {
                    this.state.dimension != undefined && this.state.dimension != "" ?
                        <NetPyNEField id={"netParams.popParams." + this.state.dimension} className={"netpyneRightField"} noStyle>
                            <PythonControlledTextField
                                id={"popParamsDimensions"}
                                handleChange={function (event, value) {
                                    var newValue = (event.target.type == 'number') ? parseFloat(value) : value;
                                    // Update State
                                    this.setState({ value: newValue });
                                    var that = this;
                                    this.triggerUpdate(function () {
                                        // Set Population Dimension Python Side
                                        Utils
                                            .sendPythonMessage('netpyne_geppetto.netParams.popParams.setParam', [that.props.modelName, that.props.dimensionType, newValue])
                                            .then(function (response) {
                                                console.log("Setting Pop Dimensions Parameters");
                                                console.log("Response", response);
                                            });
                                    });
                                }}
                                model={"netParams.popParams['" + this.state.modelName + "']['" + this.state.dimension + "']"}
                                modelName={this.state.modelName}
                                dimensionType={this.state.dimension}
                            />
                        </NetPyNEField>
                        : null
                }
            </div>
        )
    }
}
