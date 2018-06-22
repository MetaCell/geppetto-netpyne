import React, { Component } from 'react';
import IconMenu from 'material-ui/IconMenu';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import Utils from '../../../Utils';
import NetPyNEAddNew from '../../general/NetPyNEAddNew';
import NetPyNEThumbnail from '../../general/NetPyNEThumbnail';
import NetPyNEStimulationTarget from './NetPyNEStimulationTarget';

export default class NetPyNEStimulationTargets extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedStimulationTarget: undefined,
      page: "main",
      subComponentExists: true
    };
    this.selectStimulationTarget = this.selectStimulationTarget.bind(this);
    this.handleNewStimulationTarget = this.handleNewStimulationTarget.bind(this);
  };

  /* Method that handles button click */
  selectStimulationTarget(StimulationTarget, buttonExists) {
    this.setState({ 
      selectedStimulationTarget: StimulationTarget,
      subComponentExists: buttonExists
    });
  };

  handleNewStimulationTarget() {
    var defaultStimulationTargets = { 'stim_target ': {'source': '', 'sec':'', 'loc': 0, 'conds': {'pop':''}}};
    var key = Object.keys(defaultStimulationTargets)[0];
    var value = defaultStimulationTargets[key];
    var model = this.state.value;
    var StimulationTargetId = Utils.getAvailableKey(model, key);
    var newStimulationTarget = Object.assign({name: StimulationTargetId}, value);
    Utils.execPythonCommand('netpyne_geppetto.netParams.stimTargetParams["' + StimulationTargetId + '"] = ' + JSON.stringify(value));
    model[StimulationTargetId] = newStimulationTarget;
    this.setState({
      value: model,
      selectedStimulationTarget: StimulationTargetId,
      subComponentExists: true
    });
  };

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
              };
            };
          };
        };
      };
    };
    return false;
  };
 
  componentDidUpdate(prevProps, prevState) {
    var newStimulationTargetName = this.hasSelectedStimulationTargetBeenRenamed(prevState, this.state);
    if (newStimulationTargetName) {
      this.setState({ selectedStimulationTarget: newStimulationTargetName });
    };
  };

  shouldComponentUpdate(nextProps, nextState) {
    var itemRenamed = this.hasSelectedStimulationTargetBeenRenamed(this.state, nextState) != false;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedStimulationTarget != nextState.selectedStimulationTarget;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if ((this.state.subComponentExists != nextState.subComponentExists) || (this.state.selectedStimulationTarget != nextState.selectedStimulationTarget))
      return true;
    if (this.state.value!=undefined) {
      newItemCreated = Object.keys(this.state.value).length != Object.keys(nextState.value).length;
    };
    return newModel || newItemCreated || itemRenamed || selectionChanged || pageChanged;
  };

  render() {
    var model = this.state.value;
    var StimulationTargets = [];
    for (var c in model) {
      if((c == this.state.selectedStimulationTarget) && !this.state.subComponentExists) {
        var action = 'netpyne_geppetto.deleteParam';
          var paramToDel = "stimTargetParams['" + this.state.selectedStimulationTarget + "']";
          Utils.sendPythonMessage(action, [paramToDel]);
        delete model[c];
        continue;
      }
      StimulationTargets.push(<NetPyNEThumbnail name={c} key={c} selected={c == this.state.selectedStimulationTarget} handleClick={this.selectStimulationTarget} />);
    };
    var selectedStimulationTarget = undefined;
    if ((this.state.selectedStimulationTarget && this.state.subComponentExists) && Object.keys(model).indexOf(this.state.selectedStimulationTarget)>-1) {
      selectedStimulationTarget = <NetPyNEStimulationTarget name={this.state.selectedStimulationTarget}/>;
    };

    var content = (
      <CardText className={"tabContainer"} expandable={true}>
        <div className={"details"}>
          {selectedStimulationTarget}
        </div>
        <div className={"thumbnails"}>
          <div className="breadcrumb">
            <IconMenu style={{ float: 'left', marginTop: "12px", marginLeft: "18px" }}
              iconButtonElement={
                <NetPyNEAddNew id={"newStimulationTargetButton"} handleClick={this.handleNewStimulationTarget} />
              }
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
            </IconMenu>
          </div>
          <div style={{ clear: "both" }}></div>
          {StimulationTargets}
        </div>
      </CardText>
    );

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Stimulation target rules"
          subtitle="Define here the rules to connect stimulation sources to targets in your network"
          actAsExpander={true}
          showExpandableButton={true}
        />
        {content}
      </Card>
    );
  };
};
