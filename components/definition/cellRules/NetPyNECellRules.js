
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

    // Create Cell Rule Client side
    Utils.execPythonCommand('netpyne_geppetto.netParams.cellParams["' + cellRuleId + '"] = ' + JSON.stringify(value));

    // Update state
    this.setState({
      value: model,
      selectedCellRule: cellRuleId
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
    var selectedCellRule = this.state.selectedCellRule;

    // Get New Available ID
    var sectionId = Utils.getAvailableKey(model[selectedCellRule]['secs'], key);

    if (model[selectedCellRule]['secs'] == undefined) {
      model[selectedCellRule]['secs'] = {};
      Utils.execPythonCommand('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"]["secs"] = {}');
    }
    Utils.execPythonCommand('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"]["secs"]["' + sectionId + '"] = ' + JSON.stringify(value));

    // Update state
    this.setState({
      value: model,
      selectedSection: sectionId
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
    var selectedCellRule = this.state.selectedCellRule;
    var selectedSection = this.state.selectedSection;

    // Get New Available ID
    var mechanismId = Utils.getAvailableKey(model[selectedCellRule].secs[selectedSection]['mechs'], key);

    // Create Mechanism Client side
    if (model[selectedCellRule].secs[selectedSection]['mechs'] == undefined) {
      model[selectedCellRule].secs[selectedSection]['mechs'] = {};
      Utils.execPythonCommand('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"]["secs"]["' + selectedSection + '"]["mechs"] = {}');
    }
    Utils.execPythonCommand('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"]["secs"]["' + selectedSection + '"]["mechs"]["' + mechanismId + '"] = ' + JSON.stringify(value));

    // Update state
    this.setState({
      value: model,
      selectedMechanism: mechanismId
    });
  }

  hasSelectedCellRuleBeenRenamed(prevState, currentState) {
    var currentModel = prevState.value;
    var model = currentState.value;
    //deal with rename
    if (currentModel != undefined && model != undefined) {
      var oldP = Object.keys(currentModel);
      var newP = Object.keys(model);
      if (oldP.length == newP.length) {
        //if it's the same lenght there could be a rename
        for (var i = 0; i < oldP.length; i++) {
          if (oldP[i] != newP[i]) {
            if (prevState.selectedCellRule != undefined) {
              if (oldP[i] == prevState.selectedCellRule) {
                return newP[i];
              }
            }
          }
        }
      }
    }
    return false;
  }

  hasSelectedSectionBeenRenamed(prevState, currentState) {
    var currentModel = prevState.value;
    var model = this.state.value;
    var currentCellRule = undefined;
    var newCellRule = undefined;

    if (prevState.value != undefined && prevState.value != undefined) {
      currentCellRule = prevState.value[currentState.selectedCellRule];
      newCellRule = currentState.value[currentState.selectedCellRule];
    }

    if (currentModel != undefined && model != undefined && prevState.selectedCellRule != undefined && currentCellRule != undefined && newCellRule != undefined) {
      //loop sections
      var oldS = Object.keys(currentCellRule.secs);
      var newS = Object.keys(newCellRule.secs);
      if (oldS.length == newS.length) {
        for (var i = 0; i < oldS.length; i++) {
          if (oldS[i] != newS[i]) {
            if (prevState.selectedSection != undefined) {
              if (oldS[i] == prevState.selectedSection) {
                return newS[i];
              }
            }
          }
        }
      }
    }
    return false;
  }

  hasSelectedMechanismBeenRenamed(prevState, currentState) {
    var currentModel = prevState.value;
    var model = this.state.value;
    var currentCellRule = undefined;
    var newCellRule = undefined;
    if (prevState.value != undefined && prevState.value != undefined) {
      currentCellRule = prevState.value[currentState.selectedCellRule];
      newCellRule = currentState.value[currentState.selectedCellRule];
    }
    var currentSection = undefined;
    var newSection = undefined;
    if (currentCellRule != undefined && newCellRule != undefined) {
      currentSection = currentCellRule.secs[currentState.selectedSection];
      newSection = newCellRule.secs[currentState.selectedSection];
    }
    if (currentModel != undefined && model != undefined && prevState.selectedSection != undefined && currentSection != undefined && newSection != undefined) {
      //loop mechanisms
      var oldM = Object.keys(currentSection.mechs);
      var newM = Object.keys(newSection.mechs);
      if (oldM.length == newM.length) {
        for (var i = 0; i < oldM.length; i++) {
          if (oldM[i] != newM[i]) {
            if (prevState.selectedMechanism != undefined) {
              if (oldM[i] == prevState.selectedMechanism) {
                return newM[i];
              }
            }
          }
        }
      }
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    //we need to check if any of the three entities have been renamed and if that's the case change the state for the selection variable
    var newCellRuleName = this.hasSelectedCellRuleBeenRenamed(prevState, this.state);
    if (newCellRuleName) {
      this.setState({ selectedCellRule: newCellRuleName });
    }
    var newSectionName = this.hasSelectedSectionBeenRenamed(prevState, this.state);
    if (newSectionName) {
      this.setState({ selectedSection: newSectionName });
    }
    var newMechanismName = this.hasSelectedMechanismBeenRenamed(prevState, this.state);
    if (newMechanismName) {
      this.setState({ selectedMechanism: newMechanismName });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    var itemRenamed = this.hasSelectedCellRuleBeenRenamed(this.state, nextState) != false || this.hasSelectedSectionBeenRenamed(this.state, nextState) != false || this.hasSelectedMechanismBeenRenamed(this.state, nextState) != false;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedCellRule != nextState.selectedCellRule || this.state.selectedSection != nextState.selectedSection || this.state.selectedMechanism != nextState.selectedMechanism;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if (!newModel) {
      newItemCreated = Object.keys(this.state.value).length != Object.keys(nextState.value).length;
      if (this.state.selectedCellRule != undefined && nextState.value[this.state.selectedCellRule]!=undefined) {
        var oldLength = this.state.value[this.state.selectedCellRule] == undefined ? 0 : Object.keys(this.state.value[this.state.selectedCellRule].secs).length;
        newItemCreated = newItemCreated || oldLength != Object.keys(nextState.value[this.state.selectedCellRule].secs).length;
      }
      if (this.state.selectedSection != undefined && nextState.value[this.state.selectedCellRule].secs[this.state.selectedSection]!=undefined) {
        var oldLength = this.state.value[this.state.selectedCellRule].secs[this.state.selectedSection] == undefined ? 0 : Object.keys(this.state.value[this.state.selectedCellRule].secs[this.state.selectedSection].mechs).length;
        newItemCreated = newItemCreated || oldLength != Object.keys(nextState.value[this.state.selectedCellRule].secs[this.state.selectedSection].mechs).length;
      }
    }
    return newModel || newItemCreated || itemRenamed || selectionChanged || pageChanged;
  }

  render() {

    var that = this;
    var model = this.state.value;
    var content;
    if (this.state.page == 'main') {

      var cellRules = [];
      for (var c in model) {
        cellRules.push(<NetPyNECellRuleThumbnail name={c} key={c} selected={c == this.state.selectedCellRule} handleClick={this.selectCellRule} />);
      }
      var selectedCellRule = undefined;
      if (this.state.selectedCellRule) {
        selectedCellRule = <NetPyNECellRule name={this.state.selectedCellRule} model={this.state.value[this.state.selectedCellRule]} selectPage={this.selectPage} />;
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
      var sectionsModel = model[this.state.selectedCellRule].secs;
      var sections = [];
      for (var s in sectionsModel) {
        sections.push(<NetPyNESectionThumbnail key={s} name={s} selected={s == this.state.selectedSection} handleClick={this.selectSection} />);
      }
      var selectedSection = undefined;
      if (this.state.selectedSection) {
        selectedSection = <NetPyNESection name={this.state.selectedSection} cellRule={this.state.selectedCellRule} name={this.state.selectedSection} model={sectionsModel[this.state.selectedSection]} selectPage={this.selectPage} />;
      }

      content = (
        <CardText className={"tabContainer"} expandable={true}>
          <div className={"thumbnails"}>
            <div className="breadcrumb">
              <FloatingActionButton
                className={"actionButton smallActionButton breadcrumbButton"}
                style={{ marginTop: "10px", float: "left" }}
                onClick={() => { that.selectPage("main"); that.setState({ selectedSection: undefined }); }}>
                {this.state.selectedCellRule}
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
      var mechanismsModel = model[this.state.selectedCellRule].secs[this.state.selectedSection].mechs;
      var mechanisms = [];
      for (var m in mechanismsModel) {
        mechanisms.push(<NetPyNEMechanismThumbnail name={m} key={m} selected={m == this.state.selectedMechanism} model={mechanismsModel[m]} handleClick={this.selectMechanism} />);
      }
      var selectedMechanism = undefined;
      if (this.state.selectedMechanism) {
        selectedMechanism = <NetPyNEMechanism cellRule={this.state.selectedCellRule} section={this.state.selectedSection} name={this.state.selectedMechanism} model={mechanismsModel[this.state.selectedMechanism]} />;
      }

      content = (
        <CardText className={"tabContainer"} expandable={true}>
          <div className={"thumbnails"}>
            <div className="breadcrumb">
              <FloatingActionButton
                className={"actionButton smallActionButton breadcrumbButton"}
                style={{ marginTop: "10px", float: "left" }}
                onClick={() => { that.selectPage("main"); that.setState({ selectedSection: undefined }); }}>
                {this.state.selectedCellRule}
              </FloatingActionButton>
              <div style={{ float: 'left', marginTop: "30px", color: 'grey', fontSize: "20px" }}>&gt;</div>
              <RaisedButton primary={true} className={"addRectangularButton breadcrumbButton"}
                onClick={() => { that.selectPage("sections"); that.setState({ selectedMechanism: undefined }); }}
                style={{ float: 'left', marginTop: "28px", color: 'white' }}
              >
                {this.state.selectedSection}
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
          id={"CellRules"}
        />
        {content}
      </Card>);
  }
}
