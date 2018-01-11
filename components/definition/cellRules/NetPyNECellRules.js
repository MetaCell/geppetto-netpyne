
import React, { Component } from 'react';
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

export default class NetPyNECellRules extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
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
    this.setState({ selectedCellRule: cellRule });
  }

  handleNewCellRule(defaultCellRules) {
    // Get Key and Value
    var key = Object.keys(defaultCellRules)[0];
    var value = defaultCellRules[key];
    var model = this.state.value;

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
      value: model,
      selectedCellRule: newCellRule
    });
  }

  selectSection(section) {
    this.setState({ selectedSection: section });
  }

  handleNewSection(defaultSectionValues) {
    // Get Key and Value
    var key = Object.keys(defaultSectionValues)[0];
    var value = defaultSectionValues[key];
    var model = this.state.value;
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
      value: model,
      selectedSection: newSection
    });
  }

  selectMechanism(mechanism) {
    this.setState({ selectedMechanism: mechanism });
  }

  handleNewMechanism(defaultMechanismValues) {
    // Get Key and Value
    var key = Object.keys(defaultMechanismValues)[0];
    var value = defaultMechanismValues[key];
    var model = this.state.value;
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
      value: model,
      selectedMechanism: newMechanism
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    var currentModel = this.state.value;
    var model = nextState.value;
    //deal with rename
    if (currentModel != undefined && model != undefined) {
      var oldP = Object.keys(currentModel);
      var newP = Object.keys(model);
      if (oldP.length == newP.length) {
        //if it's the same lenght there could be a rename
        for (var i = 0; i < oldP.length; i++) {
          if (oldP[i] != newP[i]) {
            if (this.state.selectedCellRule != undefined) {
              if (oldP[i] == this.state.selectedCellRule.name) {
                this.state.selectedCellRule.name = newP[i];
                this.forceUpdate();
              }
              //loop sections
              var oldS = Object.keys(this.state.selectedCellRule.secs);
              var newS = Object.keys(nextState.selectedCellRule.secs);
              if (oldS.length == newS.length) {
                for (var i = 0; i < oldS.length; i++) {
                  if (oldS[i] != newS[i]) {
                    if (this.state.selectedSection != undefined) {
                      if (oldS[i] == this.state.selectedSection.name) {
                        this.state.selectedSection.name = newS[i];
                        this.forceUpdate();
                      }
                      //loop mechanisms
                      var oldM = Object.keys(this.state.selectedSection.mechs);
                      var newM = Object.keys(nextState.selectedSection.mechs);
                      if (oldM.length == newM.length) {
                        for (var i = 0; i < oldM.length; i++) {
                          if (oldM[i] != newM[i]) {
                            if (this.state.selectedMechanism != undefined) {
                              if (oldM[i] == this.state.selectedMechanism.name) {
                                this.state.selectedMechanism.name = newM[i];
                                this.forceUpdate();
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return currentModel == undefined || this.state.selectedCellRule != nextState.selectedCellRule || this.state.selectedSection != nextState.selectedSection || this.state.selectedMechanism != nextState.selectedMechanism || newP.toString() != oldP.toString() || this.state.page != nextState.page;
  }

  render() {

    var that = this;
    var model = this.state.value;
    for (var m in model) {
      model[m].name = m;
    }
    var content;
    if (this.state.page == 'main') {

      var cellRules = [];
      for (var key in model) {
        cellRules.push(<NetPyNECellRuleThumbnail key={key} selected={this.state.selectedCellRule && key == this.state.selectedCellRule.name} model={model[key]} handleClick={this.selectCellRule} />);
      }
      var selectedCellRule = undefined;
      if (this.state.selectedCellRule) {
        selectedCellRule = <NetPyNECellRule model={this.state.selectedCellRule} selectPage={this.selectPage} />;
      }

      content = (
        <CardText className={"tabContainer"} expandable={true}>
          <div className={"details"}>
            {selectedCellRule}
          </div>
          <div className={"thumbnails"}>
            <div className="breadcrumb">
              <IconMenu style={{ float: 'left', marginTop: "12px", marginLeft: "18px" }}
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
        </CardText>);
    }

    else if (this.state.page == "sections") {
      var sectionsModel = model[this.state.selectedCellRule.name].secs;
      for (var m in sectionsModel) {
        sectionsModel[m].name = m;
        sectionsModel[m].parent = this.state.selectedCellRule
      }
      var sections = [];
      for (var key in sectionsModel) {
        sections.push(<NetPyNESectionThumbnail key={key} selected={this.state.selectedSection && key == this.state.selectedSection.name} model={sectionsModel[key]} handleClick={this.selectSection} />);
      }
      var selectedSection = undefined;
      if (this.state.selectedSection) {
        selectedSection = <NetPyNESection model={this.state.selectedSection} selectPage={this.selectPage} />;
      }

      content = (
        <CardText className={"tabContainer"} expandable={true}>
          <div className={"thumbnails"}>
            <div className="breadcrumb">
              <FloatingActionButton
                className={"actionButton smallActionButton breadcrumbButton"}
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
          <div className={"details"}>
            {selectedSection}
          </div>
        </CardText>
      );

    }
    else if (this.state.page == "mechanisms") {
      var mechanismsModel = model[this.state.selectedCellRule.name].secs[this.state.selectedSection.name].mechs;
      for (var m in mechanismsModel) {
        mechanismsModel[m].name = m;
        mechanismsModel[m].parent = this.state.selectedSection;
      }
      var mechanisms = [];
      for (var key in mechanismsModel) {
        mechanisms.push(<NetPyNEMechanismThumbnail key={key} selected={this.state.selectedMechanism && key == this.state.selectedMechanism.name} model={mechanismsModel[key]} handleClick={this.selectMechanism} />);
      }
      var selectedMechanism = undefined;
      if (this.state.selectedMechanism) {
        selectedMechanism = <NetPyNEMechanism model={this.state.selectedMechanism} />;
      }

      content = (
        <CardText className={"tabContainer"} expandable={true}>
          <div className={"thumbnails"}>
            <div className="breadcrumb">
              <FloatingActionButton
                className={"actionButton smallActionButton breadcrumbButton"}
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
          <div className={"details"}>
            {selectedMechanism}
          </div>
        </CardText>
      );

    }

    return (
      <Card style={{ clear: 'both' }}>
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
