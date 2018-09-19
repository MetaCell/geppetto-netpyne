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
      page: "main"
    };
    this.selectStimulationSource = this.selectStimulationSource.bind(this);
    this.handleNewStimulationSource = this.handleNewStimulationSource.bind(this);
    this.deleteStimulationSource = this.deleteStimulationSource.bind(this);
  };

  /* Method that handles button click */
  selectStimulationSource(StimulationSource) {
    this.setState({selectedStimulationSource: StimulationSource});
  };

  handleNewStimulationSource() {
    var defaultStimulationSources = { 'stim_source': { 'type': ''}};
    var key = Object.keys(defaultStimulationSources)[0];
    var value = defaultStimulationSources[key];
    var model = this.state.value;
    var StimulationSourceId = Utils.getAvailableKey(model, key);
    Utils.execPythonCommand('netpyne_geppetto.netParams.stimSourceParams["' + StimulationSourceId + '"] = ' + JSON.stringify(value));
    this.setState({
      value: model,
      selectedStimulationSource: StimulationSourceId
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
    return undefined;
  };

  componentDidUpdate(prevProps, prevState) {
    var newStimulationSourceName = this.hasSelectedStimulationSourceBeenRenamed(prevState, this.state);
    if (newStimulationSourceName !== undefined) {
      this.setState({ selectedStimulationSource: newStimulationSourceName });
    };
  };

  shouldComponentUpdate(nextProps, nextState) {
    var itemRenamed = this.hasSelectedStimulationSourceBeenRenamed(this.state, nextState) !== undefined;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedStimulationSource != nextState.selectedStimulationSource;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if (this.state.value!=undefined) {
      newItemCreated = Object.keys(this.state.value).length != Object.keys(nextState.value).length;
    };
    return newModel || newItemCreated || itemRenamed || selectionChanged || pageChanged;
  };

  deleteStimulationSource(name) {
    Utils.sendPythonMessage('netpyne_geppetto.deleteParam', ["stimSourceParams['" + name + "']"]).then((response) =>{
      var model = this.state.value;
      delete model[name];
      this.setState({value: model, selectedStimulationSource: undefined});
    });
  }

  render() {
    var model = this.state.value;
    var StimulationSources = [];
    for (var c in model) {
      StimulationSources.push(<NetPyNEThumbnail 
        name={c} 
        key={c} 
        selected={c == this.state.selectedStimulationSource} 
        deleteMethod={this.deleteStimulationSource}
        handleClick={this.selectStimulationSource} />);
    };
    
    var selectedStimulationSource = undefined;
    if ((this.state.selectedStimulationSource != undefined) && Object.keys(model).indexOf(this.state.selectedStimulationSource)>-1) {
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
          id={"StimulationSources"}
        />
        {content}
      </Card>
    );
  };
};
