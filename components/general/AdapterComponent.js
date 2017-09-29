import React, { Component } from 'react';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';

var PythonControlledCapability = require('../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);

/**
 * The slider bar can have a set minimum and maximum, and the value can be
 * obtained through the value parameter fired on an onChange event.
 */
export default class AdapterComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidUpdate(prevProps, prevState) {
        // var value = JSON.parse(this.state.value)[(limit == 'min')?0:1]
        if (this.props.value != undefined && prevProps.value != this.props.value){
            var arrayValue = JSON.parse(this.props.value);
            this.setState({minRangeTypeXValue: arrayValue[0], maxRangeTypeXValue: arrayValue[1]});
        }

        if (this.state.minRangeTypeXValue != undefined && this.state.maxRangeTypeXValue != undefined &&
        (prevState.minRangeTypeXValue != this.state.minRangeTypeXValue || prevState.maxRangeTypeXValue != this.state.maxRangeTypeXValue)){
            this.props.onUpdateInput("[" + this.state.minRangeTypeXValue + "," + this.state.maxRangeTypeXValue + "]");
        }

        
    }




    render() {
        return (
            <div>
                <TextField
                    floatingLabelText="Min x-axis"
                    value={this.state.minRangeTypeXValue}
                    onChange={(event) => this.setState({ minRangeTypeXValue: event.target.value })}
                />
                <TextField
                    floatingLabelText="Max x-axis"
                    onChange={(event) => this.setState({ maxRangeTypeXValue: event.target.value })}
                    value={this.state.maxRangeTypeXValue}
                />
            </div>
        );
    }
}