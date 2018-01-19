import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';


export default class NetPyNESectionThumbnail extends React.Component {

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

    
      <RaisedButton primary={true} className={"rectangularActionButton " + (this.props.selected ? "selectedRectangularActionButton" : "")} onClick={this.handleClick}>
        {this.props.name}
      </RaisedButton>

    );
  }
}
