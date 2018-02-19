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
        this.handleChildChange = this.handleChildChange.bind(this);
    }

    handleNewItemChange(event) {
        this.setState({ newItemValue: event.target.value })
    }

    handleChildChange(event, value) {
        var children = this.state.children
        children[event.target.id] = value;
        // Call to conversion function
        this.convertToPython(children);
    }

    addChild() {
        var children = this.state.children;
        children.push(this.state.newItemValue);
        // Call to conversion function
        this.convertToPython(children);
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
                return JSON.stringify(child);
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
            return <div key={i.toString()} style={{ marginRight: 10, float: 'left' }}>
                <TextField value={this.state.children[i]} id={i.toString()} onChange={this.handleChildChange} style={{ width: 60 }} />
                <IconButton
                    iconStyle={{ width: 7, height: 7 }}
                    className={"listButtonSmall"}
                    onClick={() => this.removeChild(i.toString())}
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
                />
                <IconButton
                    iconStyle={{ width: 10, height: 10 }}
                    className={"listButtonLarge"}
                    onClick={this.addChild}
                >
                    <FontIcon className={"fa fa-plus-circle listIcon"} />
                </IconButton>

                {childrenWithExtraProp.length > 0 && <div style={{ border: '1px solid rgba(0, 0, 0, 0.3)', padding: '0px 5px', float: 'left' }}>{childrenWithExtraProp}</div>}
            </div>
        )
    }
}