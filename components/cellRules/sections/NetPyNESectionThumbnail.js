import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default class NetPyNESectionThumbnail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      model: props.model
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.handleClick) {
      this.props.handleClick(this.state.model);
    }
  }

  render() {
    return (

      <RaisedButton className={"rectangularActionButton " + (this.props.selected ? "selectedrectangularActionButton" : "")} onClick={this.handleClick}>
        {this.state.model.name}
      </RaisedButton>

    );
  }
}
