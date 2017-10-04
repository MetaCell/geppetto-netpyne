
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Card, { CardHeader, CardText } from 'material-ui/Card';

import NetPyNECellRuleThumbnail from './NetPyNECellRuleThumbnail';
import NetPyNECellRule from './NetPyNECellRule';
import NetPyNENewCellRule from './NetPyNENewCellRule';

import NetPyNESection from './sections/NetPyNESection';
import NetPyNESectionThumbnail from './sections/NetPyNESectionThumbnail';
import NetPyNENewSection from './sections/NetPyNENewSection';
import FlatButton from 'material-ui/FlatButton';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import Utils from '../../Utils';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },

  tabContainer: {
    padding: 10,
    height: 500,
    overflow: 'auto'
  },
  card: {
    clear: 'both'
  },
  thumbnails: {
    width: '40%',
    height: 420,
    overflow: 'auto',
    float: 'left'
  },
  details: {
    width: '55%',
    float: 'right',
    marginLeft: 50
  }
};

export default class NetPyNECellRules extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      model: props.model,
      selectedCellRule: undefined,
      page: "main"
    };

    this.handleNewCellRule = this.handleNewCellRule.bind(this);

    this.selectCellRule = this.selectCellRule.bind(this);
    this.selectPage = this.selectPage.bind(this);
    this.selectSection = this.selectSection.bind(this);
    this.handleNewSection = this.handleNewSection.bind(this);
  }

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });

  handleNewCellRule(defaultCellRules) {
    // Get Key and Value
    var key = Object.keys(defaultCellRules)[0];
    var value = defaultCellRules[key];
    var model = this.state.model;

    // Get New Available ID
    var cellRuleId = Utils.getAvailableKey(model, key);

    // Create Population Object
    var newCellRule = Object.assign({ name: cellRuleId }, value);

    // Create Population Client side
    Utils.execPythonCommand('netpyne_geppetto.netParams.cellParams["' + cellRuleId + '"] = ' + JSON.stringify(value));

    // Update state
    model[cellRuleId] = newCellRule;
    this.setState({
      model: model,
      selectedCellRule: newCellRule
    });
  }

  selectCellRule(cellRule) {
    this.setState({ model: this.state.model, selectedCellRule: cellRule });
  }

  selectPage(page) {
    this.setState({ page: page });
  }

  selectSection(section) {
    this.setState({ model: this.state.model, selectedSection: section });
  }

  handleNewSection(defaultSectionValues) {
    // Get Key and Value
    var key = Object.keys(defaultSectionValues)[0];
    var value = defaultSectionValues[key];
    var model = this.state.model;
    var selectedCellRule=this.state.selectedCellRule.name;

    // Get New Available ID
    var sectionId = Utils.getAvailableKey(model[selectedCellRule]['secs'], key);

    // Create Section Object
    var newSection = Object.assign({ name: sectionId , parent: this.state.selectedCellRule }, value);

    // Create Population Client side
    if (model[selectedCellRule]['secs'] == undefined) {
      model[selectedCellRule]['secs'] = {};
      Utils.execPythonCommand('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"]["secs"] = {}');
    }
    Utils.execPythonCommand('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"]["secs"]["' + sectionId + '"] = ' + JSON.stringify(value));

    // Update state
    model[selectedCellRule]['secs'][sectionId] = newSection;
    this.setState({
      model: model,
      selectedSection: newSection
    });
  }

  render() {

    var that = this;
    var content;
    if (this.state.page == 'main') {

      var cellRules = [];
      for (var key in this.state.model) {
        cellRules.push(<NetPyNECellRuleThumbnail selected={this.state.selectedCellRule && key == this.state.selectedCellRule.name} model={this.state.model[key]} handleClick={this.selectCellRule} />);
      }
      var selectedCellRule = undefined;
      if (this.state.selectedCellRule) {
        selectedCellRule = <NetPyNECellRule requirement={this.props.requirement} model={this.state.selectedCellRule} selectPage={this.selectPage} />;
      }

      content = (
        <Paper style={styles.tabContainer} expandable={true}>
          <div style={styles.details}>
            {selectedCellRule}
          </div>
          <div style={styles.thumbnails}>
            <IconMenu style={{ float: 'left' }}
              iconButtonElement={
                <NetPyNENewCellRule handleClick={this.handleNewCellRule} />
              }
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
            </IconMenu>
            <div style={{ clear: "both" }}></div>
            {cellRules}
          </div>
        </Paper>);
    }
    else if (this.state.page == "sections") {

      var sections = [];
      for (var key in this.state.model[this.state.selectedCellRule.name].secs) {
        sections.push(<NetPyNESectionThumbnail selected={this.state.selectedSection && key == this.state.selectedSection.name} model={this.state.model[this.state.selectedCellRule.name].secs[key]} handleClick={this.selectSection} />);
      }
      var selectedSection = undefined;
      if (this.state.selectedSection) {
        selectedSection = <NetPyNESection requirement={this.props.requirement} model={this.state.selectedSection} />;
      }

      content = (
        <Paper style={styles.tabContainer} expandable={true}>
          <div style={styles.thumbnails}>
            <FlatButton
              label={"Back to " + this.state.selectedCellRule.name}
              labelPosition="before"
              primary={true}
              style={{ marginTop: "10px", float: "right" }}
              onClick={() => { that.selectPage("main"); that.setState({ selectedSection: undefined }); }}
            />
            <IconMenu style={{ float: 'left' }}
              iconButtonElement={
                <NetPyNENewSection handleClick={this.handleNewSection} />
              }
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
            </IconMenu>
            <div style={{ clear: "both" }}></div>
            {sections}
          </div>
          <div style={styles.details}>
            {selectedSection}
          </div>
        </Paper>
      );

    }

    return (
      <Card style={styles.card}>
        <CardHeader
          title="Cell rules"
          subtitle="Define here the rules to generate the cells in your network"
          actAsExpander={true}
          showExpandableButton={true}
        />
        {content}
      </Card>);
  }
}
