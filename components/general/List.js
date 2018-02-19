import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

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
        this.handleChange = this.handleChange.bind(this);
        this.handleChildChange = this.handleChildChange.bind(this);
    }

    handleChange(event) {
        this.setState({ newItemValue: event.target.value })
    }

    handleChildChange(event, value) {
        var children = this.state.children
        children[event.target.id] = value;

        // Call to conversion function
        this.convertToPython(children);
    }

    convertToPython(children) {
        // Update State
        this.setState({ children: children, newItemValue: "" });

        var newValue = this.state.children.map((child, i) => {
            return parseFloat(child);
        })
        if (newValue != undefined && this.state.value != newValue) {
            this.props.onChange(null, null, newValue);
        }
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

    convertFromPython(prevProps, prevState, value) {
        if (value != undefined && prevProps.value != value && value != '') {
            return value.map((child, i) => {
                return child
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
            return <div style={{ marginRight: 10, float: 'left' }}>
                <TextField value={this.state.children[i]} id={i.toString()} onChange={this.handleChildChange} style={{ width: 25 }} />
                <FloatingActionButton mini={true} iconStyle={{ height: 15, width: 15 }} onClick={() => this.removeChild(i.toString())}>
                    <ContentRemove />
                </FloatingActionButton>
            </div>
        });

        return (
            <div>
                <TextField
                    floatingLabelText={this.props.floatingLabelText ? "Add new " + this.props.floatingLabelText : "Add new item"}
                    onChange={this.handleChange}
                    value={this.state.newItemValue}
                    style={{ width: '100%' }}
                />
                <FloatingActionButton mini={true} iconStyle={{ height: 15, width: 15 }} onClick={this.addChild}>
                    <ContentAdd />
                </FloatingActionButton>


                {childrenWithExtraProp.length > 0 && <div style={{ border: '1px solid rgba(0, 0, 0, 0.3)', padding: '0px 5px', float: 'left' }}>{childrenWithExtraProp}</div>}
            </div>
        )
    }
}