import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Card, { CardHeader, CardText } from 'material-ui/Card';

var PythonControlledCapability = require('../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledComponent(SelectField);

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

export default class NetPyNESimConfig extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      model: props.model,
      page: 'main'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    //this.setDuration = this.setDuration.bind(this);

  }

  setPage(page) {
    this.setState({ page: page });
  }

  // setDuration(event, value) {
  //   console.log("setDuration");
  //   GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.duration', parameters:[this.state.model.name, 'duration', value]});
  // }

  handleDurationChange(event, index, value) {
    this.setState({ duration: value });
  }

  handleChange(event) {
    var model = this.state.model;
    model.name = event.target.value;
    this.setState({
      model: model,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      model: nextProps.model
    });
  }

  render() {
    var content;

    if (this.state.page == 'main') {
      content = (
        <Card style={styles.card}>
          <CardHeader
            title="Configuration"
            subtitle="General configuration"
            actAsExpander={true}
            showExpandableButton={true}
          />
          <Paper style={styles.tabContainer} expandable={true}>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.duration"}
                floatingLabelText="Duration"
              /><br />
            </div>
        </Paper>
      </Card>);

    }
    return content;
  }
}
