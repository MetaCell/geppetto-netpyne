import React, { Component } from 'react';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import NetPyNEStimulationThumbnail from './NetPyNEStimulationThumbnail';
import NetPyNEStimulationTarget from './NetPyNEStimulationTarget';
import NetPyNENewStimulationTarget from './NetPyNENewStimulationTarget';

import Utils from '../../../Utils';

export default class NetPyNEStimulationTargets extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      selectedStimulationTarget: undefined,
      page: "main"
    };

    this.selectPage = this.selectPage.bind(this);

    this.selectStimulationTarget = this.selectStimulationTarget.bind(this);
    this.handleNewStimulationTarget = this.handleNewStimulationTarget.bind(this);
    
  }

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });


  selectPage(page) {
    this.setState({ page: page });
  }

  selectStimulationTarget(StimulationTarget) {
    this.setState({ selectedStimulationTarget: StimulationTarget });
  }

  handleNewStimulationTarget(defaultStimulationTargets) {
    // Get Key and Value
    var key = Object.keys(defaultStimulationTargets)[0];
    var value = defaultStimulationTargets[key];
    var model = this.state.value;

    // Get New Available ID
    var StimulationTargetId = Utils.getAvailableKey(model, key);

    // Create Cell Rule Client side
    Utils.execPythonCommand('netpyne_geppetto.netParams.stimTargetParams["' + StimulationTargetId + '"] = ' + JSON.stringify(value));

    // Update state
    this.setState({
      value: model,
      selectedStimulationTarget: StimulationTargetId
    });
  }


  hasSelectedStimulationTargetBeenRenamed(prevState, currentState) {
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
            if (prevState.selectedStimulationTarget != undefined) {
              if (oldP[i] == prevState.selectedStimulationTarget) {
                return newP[i];
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
    var newStimulationTargetName = this.hasSelectedStimulationTargetBeenRenamed(prevState, this.state);
    if (newStimulationTargetName) {
      this.setState({ selectedStimulationTarget: newStimulationTargetName });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    var itemRenamed = this.hasSelectedStimulationTargetBeenRenamed(this.state, nextState) != false;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedStimulationTarget != nextState.selectedStimulationTarget;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if (!newModel) {
      newItemCreated = Object.keys(this.state.value).length != Object.keys(nextState.value).length;
    }
    return newModel || newItemCreated || itemRenamed || selectionChanged || pageChanged;
  }

  render() {

    var that = this;
    var model = this.state.value;
    var content;
    if (this.state.page == 'main') {

      var StimulationTargets = [];
      for (var c in model) {
        StimulationTargets.push(<NetPyNEStimulationThumbnail name={c} key={c} selected={c == this.state.selectedStimulationTarget} handleClick={this.selectStimulationTarget} />);
      }
      var selectedStimulationTarget = undefined;
      if (this.state.selectedStimulationTarget) {
        selectedStimulationTarget = <NetPyNEStimulationTarget name={this.state.selectedStimulationTarget} model={this.state.value[this.state.selectedStimulationTarget]} selectPage={this.selectPage} />;
      }

      content = (
        <CardText className={"tabContainer"} expandable={true}>
          <div className={"details"}>
            {selectedStimulationTarget}
          </div>
          <div className={"thumbnails"}>
            <div className="breadcrumb">
              <IconMenu style={{ float: 'left', marginTop: "12px", marginLeft: "18px" }}
                iconButtonElement={
                  <NetPyNENewStimulationTarget handleClick={this.handleNewStimulationTarget} />
                }
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
              </IconMenu>
            </div>
            <div style={{ clear: "both" }}></div>
            {StimulationTargets}
          </div>
        </CardText>);
    }

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Stimulation targets"
          subtitle="Define here the rules to generate the stimulation targets in your network"
          actAsExpander={true}
          showExpandableButton={true}
        />
        {content}
      </Card>);
  }
}
