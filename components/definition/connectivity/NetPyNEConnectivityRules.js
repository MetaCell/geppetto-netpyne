import React, { Component } from 'react';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import NetPyNEConnectivityRuleThumbnail from './NetPyNEConnectivityRuleThumbnail';
import NetPyNEConnectivityRule from './NetPyNEConnectivityRule';
import NetPyNENewConnectivityRule from './NetPyNENewConnectivityRule';

import Utils from '../../../Utils';

export default class NetPyNEConnectivityRules extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      selectedConnectivityRule: undefined,
      page: "main"
    };

    this.selectPage = this.selectPage.bind(this);

    this.selectConnectivityRule = this.selectConnectivityRule.bind(this);
    this.handleNewConnectivityRule = this.handleNewConnectivityRule.bind(this);

  }

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });


  selectPage(page) {
    this.setState({ page: page });
  }

  selectConnectivityRule(connectivityRule) {
    this.setState({ selectedConnectivityRule: connectivityRule });
  }

  handleNewConnectivityRule(defaultConnectivityRules) {
    // Get Key and Value
    var key = Object.keys(defaultConnectivityRules)[0];
    var value = defaultConnectivityRules[key];
    var model = this.state.value;

    // Get New Available ID
    var connectivityRuleId = Utils.getAvailableKey(model, key);

    // Create Cell Rule Client side
    Utils.execPythonCommand('netpyne_geppetto.netParams.connParams["' + connectivityRuleId + '"] = ' + JSON.stringify(value));

    // Update state
    this.setState({
      value: model,
      selectedConnectivityRule: connectivityRuleId
    });
  }


  hasSelectedConnectivityRuleBeenRenamed(prevState, currentState) {
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
            if (prevState.selectedConnectivityRule != undefined) {
              if (oldP[i] == prevState.selectedConnectivityRule) {
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
    var newConnectivityRuleName = this.hasSelectedConnectivityRuleBeenRenamed(prevState, this.state);
    if (newConnectivityRuleName) {
      this.setState({ selectedConnectivityRule: newConnectivityRuleName });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    var itemRenamed = this.hasSelectedConnectivityRuleBeenRenamed(this.state, nextState) != false;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedConnectivityRule != nextState.selectedConnectivityRule;
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

      var ConnectivityRules = [];
      for (var c in model) {
        ConnectivityRules.push(<NetPyNEConnectivityRuleThumbnail name={c} key={c} selected={c == this.state.selectedConnectivityRule} handleClick={this.selectConnectivityRule} />);
      }
      var selectedConnectivityRule = undefined;
      if (this.state.selectedConnectivityRule) {
        selectedConnectivityRule = <NetPyNEConnectivityRule name={this.state.selectedConnectivityRule} model={this.state.value[this.state.selectedConnectivityRule]} selectPage={this.selectPage} />;
      }

      content = (

        <CardText className={"tabContainer"} expandable={true}>
          <div className={"thumbnails"}>
            <div className="breadcrumb">
              <IconMenu style={{ float: 'left', marginTop: "12px", marginLeft: "18px" }}
                iconButtonElement={
                  <NetPyNENewConnectivityRule handleClick={this.handleNewConnectivityRule} />
                }
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
              </IconMenu>
            </div>
            <div style={{ clear: "both" }}></div>
            {ConnectivityRules}
          </div>
          <div className={"details"}>
            {selectedConnectivityRule}
          </div>
        </CardText>);
    }

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Connectivity rules"
          subtitle="Define here the rules to generate the connections in your network"
          actAsExpander={true}
          showExpandableButton={true}
        />
        {content}
      </Card>);
  }
}
