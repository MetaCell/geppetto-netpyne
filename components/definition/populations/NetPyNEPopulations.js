
import React, { Component } from 'react';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import NetPyNEPopulationThumbnail from './NetPyNEPopulationThumbnail';
import NetPyNEPopulation from './NetPyNEPopulation';
import NetPyNENewPopulation from './NetPyNENewPopulation';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import Utils from '../../../Utils';

export default class NetPyNEPopulations extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      model: props.model,
      selectedPopulation: undefined
    };

    this.id = (this.props.id == undefined) ? this.props.model : this.props.id;
    this.handleNewPopulation = this.handleNewPopulation.bind(this);
    this.selectPopulation = this.selectPopulation.bind(this);
  }

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });

  setSyncValueWithPythonHandler(handler) {
    this.syncValueWithPython = handler;
  }

  connectToPython(componentType, model) {
    var kernel = IPython.notebook.kernel;
    kernel.execute('from jupyter_geppetto.geppetto_comm import GeppettoJupyterGUISync');
    kernel.execute('GeppettoJupyterGUISync.ComponentSync(componentType="' + componentType + '",model="' + model + '",id="' + this.id + '").connect()');
  }

  disconnectFromPython() {
    var kernel = IPython.notebook.kernel;
    kernel.execute('from jupyter_geppetto.geppetto_comm import GeppettoJupyterGUISync');
    kernel.execute('GeppettoJupyterGUISync.remove_component_sync(componentType="' + this.props.componentType + '",model="' + this.id + '")');
    GEPPETTO.ComponentFactory.removeExistingComponent(this.props.componentType, this);
  }

  componentWillReceiveProps(nextProps) {
    this.disconnectFromPython();
    this.id = (nextProps.id == undefined) ? nextProps.model : nextProps.id;
    GEPPETTO.ComponentFactory.addExistingComponent(nextProps.componentType, this);
    this.connectToPython(nextProps.componentType, nextProps.model);
    if (this.state.value != nextProps.value) {
      this.setState({ value: (nextProps.value === undefined) ? '' : nextProps.value });
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    var currentModel = this.state.value;
    var model = nextState.value;
    return currentModel==undefined || this.state.selectedPopulation != nextState.selectedPopulation || Object.keys(model).toString()!=Object.keys(currentModel).toString();
 }

  componentDidMount() {
    GEPPETTO.ComponentFactory.addExistingComponent(this.props.componentType, this, true);
    if (this.props.model != undefined) {
      this.connectToPython(this.props.componentType, this.props.model);
    }
  }

  handleNewPopulation(defaultPopulationValues) {
    // Get Key and Value
    var key = Object.keys(defaultPopulationValues)[0];
    var value = defaultPopulationValues[key];
    var model = this.state.value;

    // Get New Available ID
    var populationId = Utils.getAvailableKey(model, key);

    // Create Population Object
    var newPopulation = Object.assign({ name: populationId }, value);

    // Create Population Client side
    Utils.execPythonCommand('netpyne_geppetto.netParams.popParams["' + populationId + '"] = ' + JSON.stringify(value))

    // Update state
    model[populationId] = newPopulation;
    this.setState({
      value: model,
      selectedPopulation: newPopulation
    });

  }

  selectPopulation(population) {
    this.setState({ selectedPopulation: population });
  }

  render() {

    if (this.state.value != undefined && this.state.value !="") {
      var model = this.state.value;
      for (var m in model) {
        model[m].name = m;
      }
      var populations = [];
      for (var key in model) {
        populations.push(<NetPyNEPopulationThumbnail key={key} selected={this.state.selectedPopulation && key == this.state.selectedPopulation.name} model={model[key]} handleClick={this.selectPopulation} />);
      }
      var selectedPopulation = undefined;
      if (this.state.selectedPopulation) {
        selectedPopulation = <NetPyNEPopulation model={this.state.selectedPopulation}/>;
      }
    }

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Populations"
          subtitle="Define here the populations of your network"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText className={"tabContainer"} expandable={true}>
          <IconMenu style={{ float: 'left' }}
            iconButtonElement={
              <NetPyNENewPopulation handleClick={this.handleNewPopulation} />
            }
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          >
          </IconMenu>
          <div className={"details"}>
            {selectedPopulation}
          </div>
          <div className={"thumbnails"}>
            {populations}
          </div>
        </CardText>
      </Card>

    );
  }
}
