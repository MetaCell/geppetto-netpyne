import React, { Component } from 'react';
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export default class NetPyNENewPlot extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  };
  
  handleButtonClick = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
  
  handleClick(event, value) {
    this.handleRequestClose();
    this.props.handleClick(value);
  };
  
  render() {
    return <div>
      <FloatingActionButton mini={true} style={{ margin: 10, float: 'left'}} onClick={this.handleButtonClick}>
        <ContentAdd />
      </FloatingActionButton>
      <Popover
        open={this.state.open}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={this.handleRequestClose}
      >
        <Menu onChange={this.handleClick}>
          <MenuItem key={"plotRaster"} value={"plotRaster"} primaryText={"plotRaster"}/>
          <MenuItem key={"plotSpikeHist"} value={"plotSpikeHist"} primaryText={"plotSpikeHist"}/>
          <MenuItem key={"plotSpikeStats"} value={"plotSpikeStats"} primaryText={"plotSpikeStats"}/>
          <MenuItem key={"plotRatePSD"} value={"plotRatePSD"} primaryText={"plotRatePSD"}/>
          <MenuItem key={"plotTraces"} value={"plotTraces"} primaryText={"plotTraces"}/>
          <MenuItem key={"plotLFP"} value={"plotLFP"} primaryText={"plotLFP"}/>
          <MenuItem key={"plotShape"} value={"plotShape"} primaryText={"plotShape"}/>
          <MenuItem key={"plot2Dnet"} value={"plot2Dnet"} primaryText={"plot2Dnet"}/>
          <MenuItem key={"plotConn"} value={"plotConn"} primaryText={"plotConn"}/>
          <MenuItem key={"granger"} value={"granger"} primaryText={"granger"}/>
        </Menu>
      </Popover>
    </div>
  };
};
