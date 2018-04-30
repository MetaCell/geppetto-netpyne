import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import NetPyNEField from './NetPyNEField';
import MenuItem from 'material-ui/MenuItem';
import Utils from '../../Utils';

export default class PySelectField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValue: ''
    };
    this.handleCurrentValueChange = this.handleCurrentValueChange.bind(this);
    this.createMenuItems = this.createMenuItems.bind(this);
  };

  componentDidMount () {
    Utils
      .sendPythonMessage(this.props.model)
      .then(response => {
        if (this.props.onChange!=undefined) this.props.onChange(response);
        this.setState({currentValue: response});
      });
  };
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.model!=this.props.model) {
      Utils
        .sendPythonMessage(nextProps.model)
        .then(response => {
          if (this.props.onChange!=undefined) this.props.onChange(response);
          this.setState({currentValue: response});
        });
    };
  };
  
  handleCurrentValueChange = (event, index, value) => {
    Utils.execPythonCommand("netpyne_geppetto." + this.props.model + "= '" + value + "'");
    if (this.props.onChange!=undefined) this.props.onChange(value);
    this.setState({currentValue : value});
  };
  
  createMenuItems = () => {
    return this.props.items.map((name) => (
      <MenuItem
        key={name}
        value={name}
        primaryText={name}
      />
    ));
  };
  
  render() {
    var content = (
      <div>
        <NetPyNEField id={this.props.meta} className={"listStyle"} >
          <SelectField onChange={this.handleCurrentValueChange} value={this.state.currentValue}>
            {this.createMenuItems()}
          </SelectField >
        </NetPyNEField>
      </div>
    );
    return content;
  };
};
