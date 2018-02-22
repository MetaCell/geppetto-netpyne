
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
      selectedPopulation: undefined
    };

    this.handleNewPopulation = this.handleNewPopulation.bind(this);
    this.selectPopulation = this.selectPopulation.bind(this);
  }

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });


  shouldComponentUpdate(nextProps, nextState) {
    var currentModel = this.state.value;
    var model = nextState.value;
    //deal with rename
    if(currentModel!=undefined && model!=undefined){
      var oldP = Object.keys(currentModel);
      var newP = Object.keys(model);
      if (oldP.length == newP.length) {
        //if it's the same lenght there could be a rename
        for (var i = 0; i < oldP.length; i++) {
          if (oldP[i] != newP[i]) {
            if(this.state.selectedPopulation!=undefined){
              if (oldP[i] == this.state.selectedPopulation.name) {
                this.state.selectedPopulation.name = newP[i];
                this.forceUpdate();
              }
            }
          }
        }
      }
    }
    return currentModel == undefined || this.state.selectedPopulation != nextState.selectedPopulation || newP.toString() != oldP.toString();
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

    if (this.state.value != undefined && this.state.value != "") {
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
        selectedPopulation = <NetPyNEPopulation model={this.state.selectedPopulation} />;
      }
    }

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Populations"
          subtitle="Define here the populations of your network"
          actAsExpander={true}
          showExpandableButton={true}
          id={"Populations"}
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
