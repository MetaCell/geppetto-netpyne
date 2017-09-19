import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import IconMenu from 'material-ui/IconMenu';

import NetPyNESection from './sections/NetPyNESection';
import NetPyNESectionThumbnail from './sections/NetPyNESectionThumbnail';
import NetPyNENewSection from './sections/NetPyNENewSection';


var PythonControlledCapability = require('../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledComponent(SelectField);

import Utils from '../../Utils';

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

export default class NetPyNECellRule extends React.Component {

  constructor(props) {
    super(props);

    var _this = this;
    this.state = {
      model: props.model,
      page: 'main',
    };

    this.handleNewSection = this.handleNewSection.bind(this);
    this.setPage = this.setPage.bind(this);
    this.selectSection = this.selectSection.bind(this);
  }

  handleNewSection(defaultSectionValues) {
    // Get Key and Value
    var key = Object.keys(defaultSectionValues)[0];
    var value = defaultSectionValues[key];
    var model = this.state.model;

    // Get New Available ID
    var sectionId = Utils.getAvailableKey(model['secs'], key);

    // Create Population Object
    var newSection = value;
    newSection.name = sectionId;

    // Create Population Client side
    if (model['secs'] == undefined) {
      model['secs'] = {};
      Utils.execPythonCommand('netParams.cellParams["' + this.props.path + '"]["secs"] = {}');
    }
    Utils.execPythonCommand('netParams.cellParams["' + this.props.path + '"]["secs"]["' + sectionId + '"] = ' + JSON.stringify(value));

    // Update state
    model['secs'][sectionId] = newSection;
    this.setState({
      model: model,
      selectedSection: newSection
    });
  }

  setPage(page) {
    this.setState({ page: page });
  }

  selectSection(section) {
    this.setState({ model: this.state.model, selectedSection: section });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ model: nextProps.model });
  }

  render() {
    var sections = [];
    for (var key in this.state.model.secs) {
      sections.push(<NetPyNESectionThumbnail selected={this.state.selectedSection && key == this.state.selectedSection.name} model={this.state.model.secs[key]} path={key} handleClick={this.selectSection} />);
    }
    var selectedSection = undefined;
    if (this.state.selectedSection) {
      selectedSection = <NetPyNESection requirement={this.props.requirement} model={this.state.selectedSection} path={this.props.path} />;
    }


    if (this.state.page == 'main') {
      var content = (<div>
        <TextField
          value={this.state.model.name}
          floatingLabelText="The name of the cell rule"
        /><br />
        Conditions:<br />
        <TextField
          floatingLabelText="Conditions Cell Type"
          model={"netParams.cellParams['" + this.state.model.name + "']['conds']['cellType']"}
        /><br />
        <TextField
          floatingLabelText="Conditions Cell Model"
          model={"netParams.cellParams['" + this.state.model.name + "']['conds']['cellModel']"}
        /><br />

        Sections:

        <Paper style={styles.tabContainer} expandable={true}>
          <IconMenu style={{ float: 'left' }}
            iconButtonElement={
              <NetPyNENewSection handleClick={this.handleNewSection} />
            }
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          >
          </IconMenu>
          <div style={{ clear: 'both' }} />
          <div style={styles.thumbnails}>
            {sections}
          </div>
          <div style={styles.details}>
            {selectedSection}
          </div>
        </Paper>


      </div>);
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}
