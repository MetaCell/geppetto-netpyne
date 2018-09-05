import React, { Component } from 'react';
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Utils from '../../../../../Utils';

export default class NetPyNENewMechanism extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      mechanisms: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  };
  
  componentDidMount() {
    Utils
      .sendPythonMessage("netpyne_geppetto.getAvailableMechs", [])
      .then((response) => {
        var menuItems = []
        response.forEach((item) => 
          menuItems.push(<MenuItem id={item} key={item} value={item} primaryText={item}/>)
        )
        this.setState({mechanisms: menuItems})
      })
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
      <FloatingActionButton id={"addNewMechButton"} mini={true} style={{ margin: 10, float: 'left'}} onClick={this.handleButtonClick}>
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
          {this.state.mechanisms}
        </Menu>
      </Popover>
    </div>
  };
};
