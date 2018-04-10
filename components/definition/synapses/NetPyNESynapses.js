import React, { Component } from 'react';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import NetPyNESynapseThumbnail from './NetPyNESynapseThumbnail';
import NetPyNESynapse from './NetPyNESynapse';
import NetPyNENewSynapse from './NetPyNENewSynapse';

import Utils from '../../../Utils';

export default class NetPyNESynapses extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      selectedSynapse: undefined,
      page: "main"
    };

    this.selectPage = this.selectPage.bind(this);

    this.selectSynapse = this.selectSynapse.bind(this);
    this.handleNewSynapse = this.handleNewSynapse.bind(this);
    
  }

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });


  selectPage(page) {
    this.setState({ page: page });
  }

  selectSynapse(Synapse) {
    this.setState({ selectedSynapse: Synapse });
  }

  handleNewSynapse(defaultSynapses) {
    // Get Key and Value
    var key = Object.keys(defaultSynapses)[0];
    var value = defaultSynapses[key];
    var model = this.state.value;

    // Get New Available ID
    var SynapseId = Utils.getAvailableKey(model, key);

    // Create Cell Rule Client side
    Utils.execPythonCommand('netpyne_geppetto.netParams.synMechParams["' + SynapseId + '"] = ' + JSON.stringify(value));

    // Update state
    this.setState({
      value: model,
      selectedSynapse: SynapseId
    });
  }


  hasSelectedSynapseBeenRenamed(prevState, currentState) {
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
            if (prevState.selectedSynapse != undefined) {
              if (oldP[i] == prevState.selectedSynapse) {
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
    var newSynapseName = this.hasSelectedSynapseBeenRenamed(prevState, this.state);
    if (newSynapseName) {
      this.setState({ selectedSynapse: newSynapseName });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    var itemRenamed = this.hasSelectedSynapseBeenRenamed(this.state, nextState) != false;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedSynapse != nextState.selectedSynapse;
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

      var Synapses = [];
      for (var c in model) {
        Synapses.push(<NetPyNESynapseThumbnail name={c} key={c} selected={c == this.state.selectedSynapse} handleClick={this.selectSynapse} />);
      }
      var selectedSynapse = undefined;
      if (this.state.selectedSynapse && Object.keys(model).indexOf(this.state.selectedSynapse)>-1) {
        selectedSynapse = <NetPyNESynapse name={this.state.selectedSynapse} model={this.state.value[this.state.selectedSynapse]} selectPage={this.selectPage} />;
      }

      content = (
        <CardText className={"tabContainer"} expandable={true}>
          <div className={"details"}>
            {selectedSynapse}
          </div>
          <div className={"thumbnails"}>
            <div className="breadcrumb">
              <IconMenu style={{ float: 'left', marginTop: "12px", marginLeft: "18px" }}
                iconButtonElement={
                  <NetPyNENewSynapse handleClick={this.handleNewSynapse} />
                }
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
              </IconMenu>
            </div>
            <div style={{ clear: "both" }}></div>
            {Synapses}
          </div>
        </CardText>);
    }

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Synapses"
          subtitle="Define here the rules to generate the synapses in your network"
          actAsExpander={true}
          showExpandableButton={true}
          id={"Synapses"}
        />
        {content}
      </Card>);
  }
}
