import React, { Component } from 'react';
import IconMenu from 'material-ui/IconMenu';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import Utils from '../../../Utils';
import NetPyNEPlot from './NetPyNEPlot';
import NetPyNENewPlot from './NetPyNENewPlot';
import NetPyNEPlotThumbnail from './NetPyNEPlotThumbnail';

export default class NetPyNEPlots extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedPlot: undefined,
    };
    this.selectPlot = this.selectPlot.bind(this);
    this.handleNewPlot = this.handleNewPlot.bind(this);
  };

  selectPlot(plot) {
    this.setState({ selectedPlot: plot });
  };

  handleNewPlot(plot) {
    if (this.state.value!=undefined) {
        var model = this.state.value;
        model[plot] = true;
    } else {
        var model = {plot : true}
    };
    Utils
      .sendPythonMessage("netpyne_geppetto.getAvailablePlots", [])
      .then((response) => {
        if (response.includes(plot)) {
          if (plot=="plotLFP") {
            var include = {
              'electrodes': ['all']
            }
          } else if (plot=="plotShape") {
            var include = {
              'includePre': ['all'], 
              'includePost': ['all']
            }
          } else if (plot=="granger") {
            var include = {
              'cells1': ['all'], 
              'cells2': ['all']
            }
          } else {
            var include = {
              'include': ['all']
            }
          };
          Utils.execPythonCommand("netpyne_geppetto.simConfig.analysis['" + plot + "'] = "+JSON.stringify(include));
        }
      });
    this.setState({
      value: model,
      selectedPlot: plot
    });
  };
  
  shouldComponentUpdate(nextProps, nextState) {
    var newItemCreated = false;
    var selectionChanged = this.state.selectedPlot != nextState.selectedPlot;
    if (this.state.value!=undefined) {
      newItemCreated = Object.keys(this.state.value).length != Object.keys(nextState.value).length;
    };
    return newItemCreated || selectionChanged;
  };

  render() {
    var Plots = [];
    for (var c in this.state.value) {
      Plots.push(<NetPyNEPlotThumbnail name={c} key={c} selected={c == this.state.selectedPlot} handleClick={this.selectPlot} />);
    };
    if (this.state.selectedPlot ) {
      var selectedPlot = <NetPyNEPlot name={this.state.selectedPlot} />;
    };
    
    var content = (
      <CardText className={"tabContainer"} expandable={true}>
        <div className={"thumbnails"}>
          <div className="breadcrumb">
            <IconMenu style={{ float: 'left', marginTop: "12px", marginLeft: "18px" }}
              iconButtonElement={
                <NetPyNENewPlot handleClick={this.handleNewPlot} />
              }
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
            </IconMenu>
          </div>
          <div style={{ clear: "both" }}></div>
          {Plots}
        </div>
        <div className={"details"}>
          {selectedPlot}
        </div>
      </CardText>);
      
    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Plot Configuration"
          subtitle="Define rules to generate Plots (or do it later after instantiation or simulation)."
          actAsExpander={true}
          showExpandableButton={true}
          id="Plots"
        />
        {content}
      </Card>
    );
  };
};
