import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import NetPyNEPopulations from './components/definition/populations/NetPyNEPopulations';
import NetPyNECellRules from './components/definition/cellRules/NetPyNECellRules';
import NetPyNESynapses from './components/definition/synapses/NetPyNESynapses';
import NetPyNESimConfig from './components/definition/configuration/NetPyNESimConfig';
import NetPyNEInstantiated from './components/instantiation/NetPyNEInstantiated';
import Utils from './Utils';

var PythonControlledCapability = require('../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledNetPyNEPopulations = PythonControlledCapability.createPythonControlledComponent(NetPyNEPopulations);
var PythonControlledNetPyNECellRules = PythonControlledCapability.createPythonControlledComponent(NetPyNECellRules);

export default class NetPyNETabs extends React.Component {

  constructor(props) {
    super(props);

    this.widgets = {};
    this.state = {
      value: 'define',
      model: null,
      openDialog: false
    };

    GEPPETTO.on('OriginalModelLoaded', (model) => {
      var modelObject = JSON.parse(model);
      window.metadata = modelObject.metadata;
      window.requirement = modelObject.requirement;
      this.setState({ model: modelObject })
    });

  }

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  instantiate = (model) => {
    var that = this;

    Utils.sendPythonMessage('netpyne_geppetto.instantiateNetPyNEModelInGeppetto', [])
      .then(response => {
        that.handleCloseDialog();
        console.log("Instantiate NetPyNE Model in Geppetto was called");
        GEPPETTO.Manager.loadModel(JSON.parse(response));
      });

  };

  simulate = (model) => {
    var that = this;

    Utils.sendPythonMessage('netpyne_geppetto.simulateNetPyNEModelInGeppetto ', [])
      .then(response => {
        that.handleCloseDialog();
        console.log("Simulate NetPyNE Model in Geppetto was called");
        GEPPETTO.Manager.loadModel(JSON.parse(response));
      });

  };


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
    var currentTab = this.state.value;
    var dialogMessage = null;
    var openDialog = false;
    var confirmActionDialog = this.handleCloseDialog;
    switch (value) {
      case "define":
        openDialog = true;
        dialogMessage = "You are back to network definition, any changes will require to reinstantiate your network."
        break;
      case "explore":
        if (currentTab == "define") {
          openDialog = true;
          dialogMessage = "We are about to instantiate your network, this could take some time.",
            confirmActionDialog = this.instantiate;
        }
        break;
      case "simulate":
        if (currentTab == "explore") {
          openDialog = true;
          dialogMessage = "We are about to simulate your network, this could take some time.",
            confirmActionDialog = this.simulate;
        }
        break;
    }

    this.hideWidgetsFor(currentTab);
    this.restoreWidgetsFor(value);

    this.setState({
      value: value,
      dialogMessage: dialogMessage,
      openDialog: openDialog,
      confirmActionDialog: confirmActionDialog
    });
  };

  render() {

    if (this.state.model == null) {
      return (<div></div>)
    }

    var defineContent = this.state.value == "define" ? (
      <div>
        <PythonControlledNetPyNEPopulations model={"netParams.popParams"} />
        <PythonControlledNetPyNECellRules model={"netParams.cellParams"} />
        <NetPyNESynapses model={""} />

        <Card style={{ clear: 'both' }}>
          <CardHeader
            title="Connections"
            subtitle="Define here the connectivity rules in your network"
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
        </Card>
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
          style={{ height: '100%' }}
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
        <Dialog
          title="NetPyNE"
          actions={<FlatButton
            label="Ok"
            primary={true}
            keyboardFocused={true}
            onClick={this.state.confirmActionDialog}
          />}
          modal={true}
          open={this.state.openDialog}
          onRequestClose={this.handleCloseDialog}
        >
          {this.state.dialogMessage}
        </Dialog>
      </div>
    )
  }
}