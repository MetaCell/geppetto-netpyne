import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import NetPyNEPopulations from './components/definition/populations/NetPyNEPopulations';
import NetPyNECellRules from './components/definition/cellRules/NetPyNECellRules';
import NetPyNESynapses from './components/definition/synapses/NetPyNESynapses';
import NetPyNEConnectivityRules from './components/definition/connectivity/NetPyNEConnectivityRules';
import NetPyNEStimulationSources from './components/definition/stimulation/NetPyNEStimulationSources';
import NetPyNEStimulationTargets from './components/definition/stimulation/NetPyNEStimulationTargets';
import NetPyNESimConfig from './components/definition/configuration/NetPyNESimConfig';
import NetPyNEInstantiated from './components/instantiation/NetPyNEInstantiated';
import Utils from './Utils';
import IconButton from 'material-ui/IconButton';
import SettingsDialog from './components/settings/Settings';
import TransitionDialog from './components/transition/Transition';
import FontIcon from 'material-ui/FontIcon';


var PythonControlledCapability = require('../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledNetPyNEPopulations = PythonControlledCapability.createPythonControlledComponent(NetPyNEPopulations);
var PythonControlledNetPyNECellRules = PythonControlledCapability.createPythonControlledComponent(NetPyNECellRules);
var PythonControlledNetPyNESynapses = PythonControlledCapability.createPythonControlledComponent(NetPyNESynapses);
var PythonControlledNetPyNEConnectivity = PythonControlledCapability.createPythonControlledComponent(NetPyNEConnectivityRules);
var PythonControlledNetPyNEStimulationSources = PythonControlledCapability.createPythonControlledComponent(NetPyNEStimulationSources);
var PythonControlledNetPyNEStimulationTargets = PythonControlledCapability.createPythonControlledComponent(NetPyNEStimulationTargets);

export default class NetPyNETabs extends React.Component {

  constructor(props) {
    super(props);

    this.widgets = {};
    this.state = {
      value: 'define',
      model: null,
      settingsOpen: false
    };

    GEPPETTO.on('OriginalModelLoaded', (model) => {
      var modelObject = JSON.parse(model);
      window.metadata = modelObject.metadata;
      window.requirement = modelObject.requirement;
      this.setState({ model: modelObject })
    });

  }

  hideWidgetsFor = (value) => {
    if (value != "define") {
      var page = this.refs[value];
      if (page) {
        var widgets = page.getOpenedWidgets();
        if (this.widgets[value]) {
          widgets = widgets.concat(this.widgets[value]);
        }
        for (var w in widgets) {
          widgets[w].hide();
        }
        this.widgets[value] = widgets;
      }
    }
  }

  restoreWidgetsFor = (value) => {
    if (value != "define") {
      var widgets = this.widgets[value];
      if (widgets) {
        for (var w in widgets) {
          widgets[w].show();
        }
      }
    }
  }

  handleChange = (value) => {
    this.hideWidgetsFor(this.state.value);
    this.restoreWidgetsFor(value);

    this.setState({
      value: value,
    });
  };

  openSettings = () => {
    this.setState({ settingsOpen: true });
  }

  closeSettings = () => {
    this.setState({ settingsOpen: false });
  }

  render() {

    if (this.state.model == null) {
      return (<div></div>)
    }

    var defineContent = this.state.value == "define" ? (
      <div>
        <PythonControlledNetPyNEPopulations model={"netParams.popParams"} />
        <PythonControlledNetPyNECellRules model={"netParams.cellParams"} />
        <PythonControlledNetPyNESynapses model={"netParams.synMechParams"} />
        <PythonControlledNetPyNEConnectivity model={"netParams.connParams"} />
        <PythonControlledNetPyNEStimulationSources model={"netParams.stimSourceParams"} />
        <PythonControlledNetPyNEStimulationTargets model={"netParams.stimTargetParams"} />
        <NetPyNESimConfig model={this.state.model.simConfig} />
      </div>
    ) : (<div></div>);
    var exploreContent = this.state.value == "explore" ? (<NetPyNEInstantiated ref={"explore"} model={this.state.model} page={"explore"} />) : (<div></div>);
    var simulateContent = this.state.value == "simulate" ? (<NetPyNEInstantiated ref={"simulate"} model={this.state.model} page={"simulate"} />) : (<div></div>);
    var bottomValue = this.state.value == "define" ? 35 : 0;
    return (
      <div>
        <Tabs
          value={this.state.value}
          style={{ height: '100%', width: 'calc(100% - 48px)', float: 'left' }}
          tabTemplateStyle={{ height: '100%' }}
          contentContainerStyle={{ bottom: bottomValue, position: 'absolute', top: 48, left: 0, right: 0, overflow: 'auto' }}
          onChange={this.handleChange}
        >
          <Tab label="Define your network" value="define">
            {defineContent}
          </Tab>
          <Tab label="Explore your network" value="explore" >
            {exploreContent}
          </Tab>
          <Tab label="Simulate and analyse" value="simulate">
            {simulateContent}
          </Tab>
        </Tabs>
        <div id="settingsIcon" style={{ float: 'left', width: '48px', backgroundColor: 'rgb(0, 188, 212)' }}>
          <IconButton onClick={this.openSettings}>
            <FontIcon className={"fa fa-cog"} />
          </IconButton>
        </div>
        <SettingsDialog open={this.state.settingsOpen} onRequestClose={this.closeSettings} />
        <TransitionDialog tab={this.state.value} />
      </div>
    )
  }
}