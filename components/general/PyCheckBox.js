import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import NetPyNEField from './NetPyNEField';
import Utils from '../../Utils';

export default class PyCheckBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
    this.updateCheck = this.updateCheck.bind(this);
  };
  
  componentDidMount() {
    Utils
      .sendPythonMessage(this.props.model)
      .then(response => {
        if (response) this.setState({checked: response});
      });
  };
  
  updateCheck = (event, isCheck) => {
    Utils.execPythonCommand("netpyne_geppetto." + this.props.model + " = " + (isCheck?'True':'False') );
    this.setState({checked : isCheck});
  };
  
  render() {
    var content = (
      <NetPyNEField id={this.props.meta} className={"netpyneCheckbox"} >
        <Checkbox
          checked={this.state.checked}
          onCheck={this.updateCheck}
        />
      </NetPyNEField>
    );
    
    return content;
  };
};
