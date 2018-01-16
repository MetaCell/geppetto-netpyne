import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

var PythonControlledCapability = require('../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);

/**
 * The slider bar can have a set minimum and maximum, and the value can be
 * obtained through the value parameter fired on an onChange event.
 */
export default class AdapterComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.handleChildChange = this.handleChildChange.bind(this);
    }
    componentDidUpdate(prevProps, prevState) {
        var newValue = this.props.convertFromPython(prevProps, prevState, this.props.value);
        if (newValue != undefined){
            this.setState(newValue);
        }
    }

    handleChildChange(event, value) {
        // Update State
        this.state[event.target.id]= value;

        // Call to conversion function
        var newValue = this.props.convertToPython(this.state);
        if (newValue != undefined && this.state.value != newValue){
            this.props.onChange(null, null, newValue);
        }
    }

    render() {

        const childrenWithExtraProp = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                onChange: this.handleChildChange,
                value: this.state[child.props.id]
            });
          });

        return (
            <div>
                {childrenWithExtraProp}
            </div>
        )
    }
}