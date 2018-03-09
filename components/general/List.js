import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

/**
 * Generic List Component
 */
export default class ListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            model: props.model,
            children: [],
            newItemValue: ""
        };

        this.addChild = this.addChild.bind(this);
        this.handleNewItemChange = this.handleNewItemChange.bind(this);
    }

    isValid(value) {
        switch (this.props.realType) {
            case 'list(float)':
                var valid = (value.match(/^-?\d*(\.\d+)?$/));
                break;
            case 'list(list(float))':
                var valid = true;
                value.split(",").forEach(element => {
                    if (!element.match(/^-?\d*(\.\d+)?$/)) {
                        valid = false;
                    }
                });
                break;
            default:
                var valid = true;
                break;
        }
        return valid;
    }

    getErrorMessage() {
        switch (this.props.realType) {
            case 'list(float)':
                var message = 'Only float numbers are allowed.';
                break;
            case 'list(list(float))':
                var message = 'Only comma separated float numbers are allowed.';
                break;
            default:
                var message = 'No valid value';
                break;
        }
        return message;
    }

    handleNewItemChange(event) {
        this.setState({ newItemValue: event.target.value, newItemErrorText: '' })
    }

    addChild() {
        if (this.state.newItemValue != '' && this.isValid(this.state.newItemValue)) {
            var children = this.state.children;
            switch (this.props.realType) {
                case 'list(list(float))':
                    var newValue = "[" + this.state.newItemValue + "]";
                    break;
                default:
                    var newValue = this.state.newItemValue;
                    break;
            }
            children.push(newValue);
            // Call to conversion function
            this.convertToPython(children);
        }
        else {
            this.setState({ newItemErrorText: this.getErrorMessage() })
        }
    }

    removeChild(childIndex) {
        var children = this.state.children;
        children.splice(childIndex, 1);
        // Call to conversion function
        this.convertToPython(children);
    }

    convertToPython(children) {
        // Update State
        this.setState({ children: children, newItemValue: "" });

        var newValue = this.state.children.map((child, i) => {
            switch (this.props.realType) {
                case 'list(float)':
                    var childConverted = parseFloat(child)
                    break;
                case 'list(list(float))':
                    var childConverted = JSON.parse(child);
                    break;
                // TODO: Decide if this is actually needed
                // case 'list(list(string))':
                //     break;
                default:
                    var childConverted = child;
                    break;
            }
            return childConverted;
        })
        if (newValue != undefined && this.state.value != newValue) {
            this.props.onChange(null, null, newValue);
        }
    }

    convertFromPython(prevProps, prevState, value) {
        if (value != undefined && prevProps.value != value && value != '') {
            return value.map((child, i) => {
                return (typeof child == 'string') ? child : JSON.stringify(child);
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        var newValue = this.convertFromPython(prevProps, prevState, this.props.value);
        if (newValue != undefined) {
            this.setState({ children: newValue });
        }
    }

    render() {

        const childrenWithExtraProp = this.state.children.map((child, i) => {
            return <div key={i.toString()} style={{ marginRight: 30, float: 'left' }}>
                <TextField
                    value={this.state.children[i]}
                    id={i.toString()}
                    // onChange={this.handleChildChange}
                    style={{ width: 60}}
                    inputStyle={{color:"rgb(2, 188, 212)"}}
                    disabled
                />
                <IconButton
                    iconStyle={{ width: 7, height: 7 }}
                    className={"listButtonSmall"}
                    onClick={() => this.removeChild(i.toString())}
                    tooltip="Remove item from the list"
                >
                    <FontIcon className={"fa fa-minus-circle listIcon"} />
                </IconButton>
            </div>
        });

        return (
            <div>
                <TextField
                    floatingLabelText={this.props.floatingLabelText ? "Add new " + this.props.floatingLabelText : "Add new item"}
                    onChange={this.handleNewItemChange}
                    value={this.state.newItemValue}
                    style={{ width: '100%' }}
                    errorText={this.state.newItemErrorText}
                />
                {!this.state.newItemErrorText &&
                    <IconButton
                        iconStyle={{ width: 10, height: 10 }}
                        className={"listButtonLarge"}
                        onClick={this.addChild}
                        tooltip="Add item to the list"
                    >
                        <FontIcon className={"fa fa-plus-circle listIcon"} />
                    </IconButton>
                }

                {childrenWithExtraProp.length > 0 && <div style={{marginTop:'15px', marginLeft: '50px', padding: '0px 5px', float: 'left' }}>{childrenWithExtraProp}</div>}
            </div>
        )
    }
}