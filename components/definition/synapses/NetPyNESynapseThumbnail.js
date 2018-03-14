import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export default class NetPyNESynapseThumbnail extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.handleClick) {
      this.props.handleClick(this.props.name);
    }
  }

  render() {
    return (

      <FloatingActionButton className={"actionButton " + (this.props.selected ? "selectedActionButton" : "")} onClick={this.handleClick}>
        {this.props.name}
      </FloatingActionButton>

    );
  }
}
