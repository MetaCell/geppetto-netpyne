import React, { Component } from 'react';
import IconMenu from 'material-ui/IconMenu';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import Utils from '../../../Utils';
import NetPyNEAddNew from '../../general/NetPyNEAddNew';
import NetPyNEThumbnail from '../../general/NetPyNEThumbnail';
import NetPyNEStimulationSource from './NetPyNEStimulationSource';

export default class NetPyNEStimulationSources extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedStimulationSource: undefined,
      page: "main",
      subComponentExists: true
    };
    this.selectStimulationSource = this.selectStimulationSource.bind(this);
    this.handleNewStimulationSource = this.handleNewStimulationSource.bind(this);
  };

  /* Method that handles button click */
  selectStimulationSource(StimulationSource, buttonExists) {
    this.setState({ 
      selectedStimulationSource: StimulationSource,
      subComponentExists: buttonExists
    });
  };

  handleNewStimulationSource() {
    var defaultStimulationSources = { 'stim_source ': { 'type': '', 'del': 0, 'dur': 0, 'amp': ''}};
    var key = Object.keys(defaultStimulationSources)[0];
    var value = defaultStimulationSources[key];
    var model = this.state.value;
    var StimulationSourceId = Utils.getAvailableKey(model, key);
    var newStimulationSource = Object.assign({name: StimulationSourceId}, value);
    Utils.execPythonCommand('netpyne_geppetto.netParams.stimSourceParams["' + StimulationSourceId + '"] = ' + JSON.stringify(value));
    model[StimulationSourceId] = newStimulationSource;
    this.setState({
      value: model,
      selectedStimulationSource: StimulationSourceId,
      subComponentExists: true
    });
  };

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
              };
            };
          };
        };
      };
    };
    return false;
  };

  componentDidUpdate(prevProps, prevState) {
    var newStimulationSourceName = this.hasSelectedStimulationSourceBeenRenamed(prevState, this.state);
    if (newStimulationSourceName) {
      this.setState({ selectedStimulationSource: newStimulationSourceName });
    };
  };

  shouldComponentUpdate(nextProps, nextState) {
    var itemRenamed = this.hasSelectedStimulationSourceBeenRenamed(this.state, nextState) != false;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedStimulationSource != nextState.selectedStimulationSource;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if ((this.state.subComponentExists != nextState.subComponentExists) || (this.state.selectedStimulationSource != nextState.selectedStimulationSource))
      return true;
    if (this.state.value!=undefined) {
      newItemCreated = Object.keys(this.state.value).length != Object.keys(nextState.value).length;
    };
    return newModel || newItemCreated || itemRenamed || selectionChanged || pageChanged;
  };

  render() {
    var model = this.state.value;
    var StimulationSources = [];
    for (var c in model) {
      if((c == this.state.selectedStimulationSource) && !this.state.subComponentExists) {
        delete model[c];
        continue;
      }
      StimulationSources.push(<NetPyNEThumbnail name={c} key={c} selected={c == this.state.selectedStimulationSource} handleClick={this.selectStimulationSource} />);
    };
    
    var selectedStimulationSource = undefined;
    if ((this.state.selectedStimulationSource && this.state.subComponentExists) && Object.keys(model).indexOf(this.state.selectedStimulationSource)>-1) {
      selectedStimulationSource = <NetPyNEStimulationSource name={this.state.selectedStimulationSource} />;
    };
    
    var content = (
      <CardText className={"tabContainer"} expandable={true}>
        <div className={"details"}>
          {selectedStimulationSource}
        </div>
        <div className={"thumbnails"}>
          <div className="breadcrumb">
            <IconMenu style={{ float: 'left', marginTop: "12px", marginLeft: "18px" }}
              iconButtonElement={
                <NetPyNEAddNew id={"newStimulationSourceButton"} handleClick={this.handleNewStimulationSource} />
              }
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
            </IconMenu>
          </div>
          <div style={{ clear: "both" }}></div>
          {StimulationSources}
        </div>
      </CardText>
    );

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Stimulation sources"
          subtitle="Define here the sources of stimulation in your network"
          actAsExpander={true}
          showExpandableButton={true}
          id={"SimulationSources"}
        />
        {content}
      </Card>
    );
  };
};
