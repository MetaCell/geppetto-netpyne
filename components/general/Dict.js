import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

/**
 * Generic List Component
 */
export default class DictComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
        model: props.model,
        children: {},
        newItemValue: ""
    };
    
    this.addChild = this.addChild.bind(this);
    this.handleNewItemChange = this.handleNewItemChange.bind(this);
  }

  isValid(value) {
    switch (this.props.realType) {
      case 'dict':
        var valid = (value.match(/:/g)||[]).length==1 && !value.startsWith(":") && !value.endsWith(":");
          break;
        default:
          var valid = true;
          break;
    }
    return valid;
  }

  getErrorMessage() {
    switch (this.props.realType) {
      case 'dict':
        var message = 'Key:Value pairs must be separated by a colon --> : ';
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
        case 'dict':
          var newValue = this.state.newItemValue.split(":").map(entry => {
            return entry
          });
          break;
        default:
          var newValue = this.state.newItemValue;
          break;
      }
      if (!isNaN(newValue[1])) { 
        newValue[1] = parseFloat(newValue[1])
      }
      children[newValue[0]] = newValue[1];
      // Call to conversion function
      this.convertToPython(children);
    } 
    else {
    this.setState({ newItemErrorText: this.getErrorMessage() })
    }
  }

  removeChild(key) {
    var children = this.state.children;
    delete children[key];
    // Call to conversion function
    this.convertToPython(children);
  }

  convertToPython(children) {
    // Update State
    this.setState({ children: children, newItemValue: "" });
    
    if (children != undefined) {
      this.props.onChange(null, null, children);
    }
  }

  convertFromPython(prevProps, prevState, value) {
    if (value != undefined && prevProps.value != value && value != '') {
      return JSON.parse(value)
    };
  }

  componentDidUpdate(prevProps, prevState) {
    var newValue = this.convertFromPython(prevProps, prevState, this.props.value);
    if (newValue != undefined) {
      this.setState({ children: newValue });
    }
  }

  render() {

    const childrenWithExtraProp = Object.keys(this.state.children).map((key) => {
      return <div key={key} style={{ marginRight: 30, float: 'left' }}>
        <TextField
          value={key + " : " + this.state.children[key]}
          id={key}
          // onChange={this.handleChildChange}
          style={{ width: 100}}
          inputStyle={{color:"rgb(2, 188, 212)"}}
          disabled
        />
        <IconButton
          iconStyle={{ width: 7, height: 7 }}
          className={"listButtonSmall"}
          onClick={() => this.removeChild(key)}
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
