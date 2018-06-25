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
        this.stateBuilder = {};
         props.children.forEach( (child, index) => {
             this.stateBuilder[child.props.id] = '';
        });
        this.state = this.stateBuilder;

        this.handleChildChange = this.handleChildChange.bind(this);
    }
    componentDidUpdate(prevProps, prevState) {
        var newValue = this.props.convertFromPython(prevProps, prevState, this.props.value);
        if (newValue != undefined){
            this.setState(newValue);
        }
    }
    
    updateInputState(event, value) {
        if(this.state != undefined)
            var returnObj = this.state;
        else
            var returnObj = {};
        returnObj[event.target.id] = value;
        return returnObj;
    }

    handleChildChange(event, value) {
        // Update State
        var stateObject = this.updateInputState(event, value);
        this.setState(stateObject);

        // Call to conversion function
        this.state["lastUpdated"] = event.target.id;
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
