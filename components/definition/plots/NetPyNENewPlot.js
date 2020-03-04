import React, { Component } from 'react';
import Menu from '@material-ui/core/Menu';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import ContentAdd from '@material-ui/icons/Add';
import FloatingActionButton from '@material-ui/core/Fab';

export default class NetPyNENewPlot extends React.Component {

  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.state = { anchorEl: null, };
  }
  
  handleButtonClick = event => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({ anchorEl: event.currentTarget, });
  };

  handleRequestClose = () => {
    this.setState({ anchorEl: null, });
  };

  handleClick (value) {
    this.handleRequestClose();
    this.props.handleClick(value );
  }
  
  render () {
    return <div>
      <FloatingActionButton color="primary" size="small" style={{ margin: 10, float: 'left' }} onClick={this.handleButtonClick}>
        <ContentAdd />
      </FloatingActionButton>

      <Menu onClose={this.props.onClose} open={Boolean(this.state.anchorEl)}
        anchorEl={this.state.anchorEl}>
        <MenuItem key={"plotTraces"} value={"plotTraces"} onClick={e => this.handleClick("plotTraces")} >
        Traces Plot
        </MenuItem>
        <MenuItem key={"plotRaster"} value={"plotRaster"} onClick={e => this.handleClick("plotRaster")}>
        Raster Plot
        </MenuItem>
        <MenuItem key={"plotSpikeHist"} value={"plotSpikeHist"} onClick={e => this.handleClick("plotSpikeHist")}>
        Spike Histogram Plot
        </MenuItem>
        <MenuItem key={"plotSpikeStats"} value={"plotSpikeStats"} onClick={e => this.handleClick("plotSpikeStats")}>
        Spike Stats Plot
        </MenuItem>
        <MenuItem key={"plotRatePSD"} value={"plotRatePSD"} onClick={e => this.handleClick("plotRatePSD")}>
        PSD Rate Plot
        </MenuItem>
        <MenuItem key={"plotLFP"} value={"plotLFP"} onClick={e => this.handleClick("plotLFP")}>
        LFP Plot
        </MenuItem>
        <MenuItem key={"plotShape"} value={"plotShape"} onClick={e => this.handleClick("plotShape")}>
        3D Cell Shape Plot
        </MenuItem>
        <MenuItem key={"plot2Dnet"} value={"plot2Dnet"} onClick={e => this.handleClick("plot2Dnet")}>
        2D Network Plot
        </MenuItem>
        <MenuItem key={"plotConn"} value={"plotConn"} onClick={e => this.handleClick("plotConn")}>
        Network Connectivity Plot
        </MenuItem>
        <MenuItem key={"granger"} value={"granger"} onClick={e => this.handleClick("granger")}>
        Granger Causality Plot
        </MenuItem>
      </Menu>

    </div>
  }
}
