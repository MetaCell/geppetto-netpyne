
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import NetPyNECellRuleThumbnail from './NetPyNECellRuleThumbnail';
import NetPyNECellRule from './NetPyNECellRule';
import NetPyNENewCellRule from './NetPyNENewCellRule';

import NetPyNESection from './sections/NetPyNESection';
import NetPyNESectionThumbnail from './sections/NetPyNESectionThumbnail';
import NetPyNENewSection from './sections/NetPyNENewSection';

import NetPyNEMechanism from './sections/mechanisms/NetPyNEMechanism';
import NetPyNEMechanismThumbnail from './sections/mechanisms/NetPyNEMechanismThumbnail';
import NetPyNENewMechanism from './sections/mechanisms/NetPyNENewMechanism';

import Utils from '../../../Utils';

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

    this.selectPage = this.selectPage.bind(this);

    this.selectCellRule = this.selectCellRule.bind(this);
    this.handleNewCellRule = this.handleNewCellRule.bind(this);


    this.selectSection = this.selectSection.bind(this);
    this.handleNewSection = this.handleNewSection.bind(this);

    this.selectMechanism = this.selectMechanism.bind(this);
    this.handleNewMechanism = this.handleNewMechanism.bind(this);
  }

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });


  selectPage(page) {
    this.setState({ page: page });
  }

  selectCellRule(cellRule) {
    this.setState({ model: this.state.model, selectedCellRule: cellRule });
  }

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

    // Create cond in population
    Utils.execPythonCommand('netpyne_geppetto.netParams.cellParams["' + cellRuleId + '"]["conds"] = {}');

    // Update state
    model[cellRuleId] = newCellRule;
    this.setState({
      model: model,
      selectedCellRule: newCellRule
    });
  }

  selectSection(section) {
    this.setState({ model: this.state.model, selectedSection: section });
  }

  handleNewSection(defaultSectionValues) {
    // Get Key and Value
    var key = Object.keys(defaultSectionValues)[0];
    var value = defaultSectionValues[key];
    var model = this.state.model;
    var selectedCellRule = this.state.selectedCellRule.name;

    // Get New Available ID
    var sectionId = Utils.getAvailableKey(model[selectedCellRule]['secs'], key);

    // Create Section Object
    var newSection = Object.assign({ name: sectionId, parent: this.state.selectedCellRule }, value);

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

  selectMechanism(mechanism) {
    this.setState({ model: this.state.model, selectedMechanism: mechanism });
  }

  handleNewMechanism(defaultMechanismValues) {
    // Get Key and Value
    var key = Object.keys(defaultMechanismValues)[0];
    var value = defaultMechanismValues[key];
    var model = this.state.model;
    var selectedCellRule = this.state.selectedCellRule.name;
    var selectedSection = this.state.selectedSection.name;

    // Get New Available ID
    var mechanismId = Utils.getAvailableKey(model[selectedCellRule].secs[selectedSection]['mechs'], key);

    // Create Mechanism Object
    var newMechanism = Object.assign({ name: mechanismId, parent: this.state.selectedSection }, value);

    // Create Mechanism Client side
    if (model[selectedCellRule].secs[selectedSection]['mechs'] == undefined) {
      model[selectedCellRule].secs[selectedSection]['mechs'] = {};
      Utils.execPythonCommand('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"].secs["' + selectedSection + '"]["mechs"] = {}');
    }
    Utils.execPythonCommand('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"].secs["' + selectedSection + '"]["mechs"]["' + mechanismId + '"] = ' + JSON.stringify(value));

    // Update state
    model[selectedCellRule].secs[selectedSection]['mechs'][mechanismId] = newMechanism;
    this.setState({
      model: model,
      selectedMechanism: newMechanism
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
            <div className="breadcrumb">
              <IconMenu style={{ float: 'left', marginTop: "12px", marginLeft:"18px" }}
                iconButtonElement={
                  <NetPyNENewCellRule handleClick={this.handleNewCellRule} />
                }
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
              </IconMenu>
            </div>
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
        selectedSection = <NetPyNESection requirement={this.props.requirement} model={this.state.selectedSection} selectPage={this.selectPage} />;
      }

      content = (
        <Paper style={styles.tabContainer} expandable={true}>
          <div style={styles.thumbnails}>
            <div className="breadcrumb">
              <FloatingActionButton
                className={"actionButton smallActionButton breadcrumbButton"}
                primary={true}
                style={{ marginTop: "10px", float: "left" }}
                onClick={() => { that.selectPage("main"); that.setState({ selectedSection: undefined }); }}>
                {this.state.selectedCellRule.name}
              </FloatingActionButton>
              <div style={{ float: 'left', marginTop: "30px", color: 'grey', fontSize: "20px" }}>&gt;</div>
              <IconMenu style={{ float: 'left', marginTop: "18px" }}
                iconButtonElement={
                  <NetPyNENewSection handleClick={this.handleNewSection} />
                }
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
              </IconMenu>
            </div>
            <div style={{ clear: "both" }}></div>
            {sections}
          </div>
          <div style={styles.details}>
            {selectedSection}
          </div>
        </Paper>
      );

    }
    else if (this.state.page == "mechanisms") {

      var mechanisms = [];
      for (var key in this.state.model[this.state.selectedCellRule.name].secs[this.state.selectedSection.name].mechs) {
        mechanisms.push(<NetPyNEMechanismThumbnail selected={this.state.selectedMechanism && key == this.state.selectedMechanism.name} model={this.state.model[this.state.selectedCellRule.name].secs[this.state.selectedSection.name].mechs[key]} handleClick={this.selectMechanism} />);
      }
      var selectedMechanism = undefined;
      if (this.state.selectedMechanism) {
        selectedMechanism = <NetPyNEMechanism requirement={this.props.requirement} model={this.state.selectedMechanism} />;
      }

      content = (
        <Paper style={styles.tabContainer} expandable={true}>
          <div style={styles.thumbnails}>
            <div className="breadcrumb">
              <FloatingActionButton
                className={"actionButton smallActionButton breadcrumbButton"}
                primary={true}
                style={{ marginTop: "10px", float: "left" }}
                onClick={() => { that.selectPage("main"); that.setState({ selectedSection: undefined }); }}>
                {this.state.selectedCellRule.name}
              </FloatingActionButton>
              <div style={{ float: 'left', marginTop: "30px", color: 'grey', fontSize: "20px" }}>&gt;</div>
              <RaisedButton primary={true} className={"addRectangularButton breadcrumbButton"}
                onClick={() => { that.selectPage("sections"); that.setState({ selectedMechanism: undefined }); }}
                style={{ float: 'left', marginTop: "28px", color: 'white' }}
              >
                {this.state.selectedSection.name}
              </RaisedButton>
              <div style={{ float: 'left', marginTop: "30px", color: 'grey', fontSize: "20px" }}>&gt;</div>
              <IconMenu style={{ float: 'left', marginTop: "18px" }}
                iconButtonElement={
                  <NetPyNENewMechanism handleClick={this.handleNewMechanism} />
                }
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
              </IconMenu>
            </div>
            <div style={{ clear: "both" }}></div>
            {mechanisms}
          </div>
          <div style={styles.details}>
            {selectedMechanism}
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
