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

 
  handleClick (event) {
    this.props.onClose();
    this.props.handleClick(event.target.value );
  }
  
  render () {
    return <div>
      <FloatingActionButton size="small" style={{ margin: 10, float: 'left' }} onClick={this.handleButtonClick}>
        <ContentAdd />
      </FloatingActionButton>
      <Popover
        open={Boolean(this.state.anchorEl)}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        onClose={this.props.onClose}
      >
        <Menu onChange={this.handleClick} onClose={this.props.onClose} >
          <MenuItem key={"plotTraces"} value={"plotTraces"} >
        Traces Plot
          </MenuItem>
          <MenuItem key={"plotRaster"} value={"plotRaster"}>
        Raster Plot
          </MenuItem>
          <MenuItem key={"plotSpikeHist"} value={"plotSpikeHist"}>
        Spike Histogram Plot
          </MenuItem>
          <MenuItem key={"plotSpikeStats"} value={"plotSpikeStats"}>
        Spike Stats Plot
          </MenuItem>
          <MenuItem key={"plotRatePSD"} value={"plotRatePSD"}>
        PSD Rate Plot
          </MenuItem>
          <MenuItem key={"plotLFP"} value={"plotLFP"}>
        LFP Plot
          </MenuItem>
          <MenuItem key={"plotShape"} value={"plotShape"}>
        3D Cell Shape Plot
          </MenuItem>
          <MenuItem key={"plot2Dnet"} value={"plot2Dnet"}>
        2D Network Plot
          </MenuItem>
          <MenuItem key={"plotConn"} value={"plotConn"}>
        Network Connectivity Plot
          </MenuItem>
          <MenuItem key={"granger"} value={"granger"}>
        Granger Causality Plot
          </MenuItem>
        </Menu>
      </Popover>
    </div>
  }
}
