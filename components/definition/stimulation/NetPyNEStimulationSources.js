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
import NetPyNEStimulationSource from './NetPyNEStimulationSource';
import NetPyNENewStimulationSource from './NetPyNENewStimulationSource';

import Utils from '../../../Utils';

export default class NetPyNEStimulationSources extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      selectedStimulationSource: undefined,
      page: "main"
    };

    this.selectPage = this.selectPage.bind(this);

    this.selectStimulationSource = this.selectStimulationSource.bind(this);
    this.handleNewStimulationSource = this.handleNewStimulationSource.bind(this);
    
  }

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });


  selectPage(page) {
    this.setState({ page: page });
  }

  selectStimulationSource(StimulationSource) {
    this.setState({ selectedStimulationSource: StimulationSource });
  }

  handleNewStimulationSource(defaultStimulationSources) {
    // Get Key and Value
    var key = Object.keys(defaultStimulationSources)[0];
    var value = defaultStimulationSources[key];
    var model = this.state.value;

    // Get New Available ID
    var StimulationSourceId = Utils.getAvailableKey(model, key);

    // Create Cell Rule Client side
    Utils.execPythonCommand('netpyne_geppetto.netParams.stimSourceParams["' + StimulationSourceId + '"] = ' + JSON.stringify(value));

    // Update state
    this.setState({
      value: model,
      selectedStimulationSource: StimulationSourceId
    });
  }


  hasSelectedStimulationSourceBeenRenamed(prevState, currentState) {
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
            if (prevState.selectedStimulationSource != undefined) {
              if (oldP[i] == prevState.selectedStimulationSource) {
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
    var newStimulationSourceName = this.hasSelectedStimulationSourceBeenRenamed(prevState, this.state);
    if (newStimulationSourceName) {
      this.setState({ selectedStimulationSource: newStimulationSourceName });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    var itemRenamed = this.hasSelectedStimulationSourceBeenRenamed(this.state, nextState) != false;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedStimulationSource != nextState.selectedStimulationSource;
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

      var StimulationSources = [];
      for (var c in model) {
        StimulationSources.push(<NetPyNEStimulationThumbnail name={c} key={c} selected={c == this.state.selectedStimulationSource} handleClick={this.selectStimulationSource} />);
      }
      var selectedStimulationSource = undefined;
      if (this.state.selectedStimulationSource) {
        selectedStimulationSource = <NetPyNEStimulationSource name={this.state.selectedStimulationSource} model={this.state.value[this.state.selectedStimulationSource]} selectPage={this.selectPage} />;
      }

      content = (
        <CardText className={"tabContainer"} expandable={true}>
          <div className={"details"}>
            {selectedStimulationSource}
          </div>
          <div className={"thumbnails"}>
            <div className="breadcrumb">
              <IconMenu style={{ float: 'left', marginTop: "12px", marginLeft: "18px" }}
                iconButtonElement={
                  <NetPyNENewStimulationSource handleClick={this.handleNewStimulationSource} />
                }
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
              </IconMenu>
            </div>
            <div style={{ clear: "both" }}></div>
            {StimulationSources}
          </div>
        </CardText>);
    }

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Stimulation sources"
          subtitle="Define here the rules to generate the stimulation sources in your network"
          actAsExpander={true}
          showExpandableButton={true}
        />
        {content}
      </Card>);
  }
}
