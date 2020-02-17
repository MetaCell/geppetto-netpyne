import React, { Component } from 'react';
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export default class NetPyNENewPlot extends React.Component {

  constructor (props) {
    super(props);
    this.state = { open: false, };
    this.handleClick = this.handleClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  
  handleButtonClick = event => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({ open: false, });
  };
  
  handleClick (event, value) {
    this.handleRequestClose();
    this.props.handleClick(value);
  }
  
  render () {
    return <div>
      <FloatingActionButton mini={true} style={{ margin: 10, float: 'left' }} onClick={this.handleButtonClick}>
        <ContentAdd />
      </FloatingActionButton>
      <Popover
        open={this.state.open}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        onRequestClose={this.handleRequestClose}
      >
        <Menu onChange={this.handleClick}>
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
