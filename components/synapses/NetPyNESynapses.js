import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Card, { CardHeader, CardText } from 'material-ui/Card';

var PythonControlledCapability = require('../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);


const styles = {
  populationCard: {
    fontSize: 24,
    margin: 10,
    width: 350,
    height: 350,
    float: 'left'
  },
  cardContent: {
  }
};

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
      <Card style={styles.card}>
        <CardHeader
          title="Synapses"
          subtitle="Define here the rules to generate the synapses in your network"
          actAsExpander={true}
          showExpandableButton={true}
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
