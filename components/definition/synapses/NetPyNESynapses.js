import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Card, { CardHeader, CardText } from 'material-ui/Card';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);

export default class NetPyNESynapses extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      model: props.model,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      model: nextProps.model
    });
  }

  render() {
    var content = (
      <Card style={{clear: 'both'}}>
        <CardHeader
          title="Synapses"
          subtitle="Define here the rules to generate the synapses in your network"
          actAsExpander={true}
          showExpandableButton={true}
          id={"Synapses"}
        />

        <CardText expandable={true}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
      </CardText>

      </Card>);


    return content;
  }
}
