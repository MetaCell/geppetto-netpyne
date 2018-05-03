import React, { Component } from 'react';
import PlotLFP from './plotTypes/PlotLFP';
import PlotConn from './plotTypes/PlotConn';
import PlotShape from './plotTypes/PlotShape';
import Plot2Dnet from './plotTypes/Plot2Dnet';
import PlotRaster from './plotTypes/PlotRaster';
import PlotTraces from './plotTypes/PlotTraces';
import PlotGranger from './plotTypes/PlotGranger';
import PlotRatePSD from './plotTypes/PlotRatePSD';
import PlotSpikeHist from './plotTypes/PlotSpikeHist';
import PlotSpikeStats from './plotTypes/PlotSpikeStats';

export default class NetPyNEPlot extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentName: props.name,
    };
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ currentName: nextProps.name });
  };

  render() {
    switch (this.state.currentName) {
      case "plotRaster":
          var content = <PlotRaster />
          break;
      case "plotSpikeHist":
          var content = <PlotSpikeHist />
          break;
      case "plotSpikeStats":
          var content = <PlotSpikeStats />
          break;
      case "plotRatePSD":
          var content = <PlotRatePSD />
          break;
      case "plotTraces":
          var content = <PlotTraces />
          break;
      case "plotLFP":
          var content = <PlotLFP />
          break;
      case "plotShape":
          var content = <PlotShape />
          break;
      case "plotConn":
          var content = <PlotConn />
          break;
      case "plot2Dnet":
          var content = <Plot2Dnet />
          break;
      case "granger":
          var content = <PlotGranger />
          break;
    };
    
    return content;
  };
};
