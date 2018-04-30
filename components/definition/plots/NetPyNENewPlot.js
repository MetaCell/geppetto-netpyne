import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  addButton: {
    margin: 10,
    float: 'left'
  }
};

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
  
  MenuItems() {
    var Plots  = ["plotRaster", "plotSpikeHist", "plotSpikeStats"]
        Plots.push(... ["plotRatePSD", "plotTraces", "plotLFP", "plotShape"])
        Plots.push(...["plot2Dnet", "plotConn", "granger"])
    return Plots.map((name) => (
      <MenuItem
        key={name}
        value={name}
        primaryText={name}
      />
    ));
  };
  
  render() {
    return (
      <div>
        <FloatingActionButton mini={true} style={styles.addButton} onClick={this.handleButtonClick}>
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
            {this.MenuItems()}
          </Menu>
        </Popover>
      </div>
    );
  }
}
