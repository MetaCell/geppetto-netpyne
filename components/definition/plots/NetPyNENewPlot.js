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

 
  handleClick (event, value) {
    this.props.onClose();
    this.props.handleClick(value);
  }
  
  render () {
    return <div>
      <FloatingActionButton mini={true} style={{ margin: 10, float: 'left' }} onClick={this.handleButtonClick}>
        <ContentAdd />
      </FloatingActionButton>
      <Popover
        open={Boolean(this.state.anchorEl)}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        onRequestClose={this.props.onClose}
      >
        <Menu onChange={this.handleClick} onClose={this.props.onClose} >
          <MenuItem key={"plotTraces"} value={"plotTraces"} primaryText={"Traces Plot"}/>
          <MenuItem key={"plotRaster"} value={"plotRaster"} primaryText={"Raster Plot"}/>
          <MenuItem key={"plotSpikeHist"} value={"plotSpikeHist"} primaryText={"Spike Histogram Plot"}/>
          <MenuItem key={"plotSpikeStats"} value={"plotSpikeStats"} primaryText={"Spike Stats Plot"}/>
          <MenuItem key={"plotRatePSD"} value={"plotRatePSD"} primaryText={"PSD Rate Plot"}/>
          <MenuItem key={"plotLFP"} value={"plotLFP"} primaryText={"LFP Plot"}/>
          <MenuItem key={"plotShape"} value={"plotShape"} primaryText={"3D Cell Shape Plot"}/>
          <MenuItem key={"plot2Dnet"} value={"plot2Dnet"} primaryText={"2D Network Plot"}/>
          <MenuItem key={"plotConn"} value={"plotConn"} primaryText={"Network Connectivity Plot"}/>
          <MenuItem key={"granger"} value={"granger"} primaryText={"Granger Causality Plot"}/>
        </Menu>
      </Popover>
    </div>
  }
}
