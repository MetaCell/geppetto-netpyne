import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export default class NetPyNEThumbnail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isAlive: true
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleHoverIn = this.handleHoverIn.bind(this);
    this.handleHoverOut = this.handleHoverOut.bind(this);
  };

  handleClick() {
    if (this.props.handleClick) {
      if(this.props.selected && this.state.isHovered) {
        this.setState({ 
          isAlive: !this.state.isAlive
        });
        this.props.handleClick(this.props.name, false);
      } else {
        this.props.handleClick(this.props.name, true);
      }
    }
  };

  handleHoverIn() {
    this.setState({
      isHovered: true
    });
  }

  handleHoverOut() {
    this.setState({
      isHovered: false
    });
  }

  render() {
      return (
        <FloatingActionButton 
          id={this.props.name}
          onMouseEnter={this.handleHoverIn}
          onMouseLeave={this.handleHoverOut}
          iconClassName={(this.state.isHovered && this.props.selected) ? "fa fa-trash-o" : ""} 
          className={"actionButton " + (this.props.selected ? "selectedActionButton" : "")} 
          onClick={this.handleClick}>
          {(this.state.isHovered && this.props.selected) ? "" : this.props.name}
        </FloatingActionButton>
      );
  };
};
