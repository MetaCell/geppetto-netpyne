import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

const hoverColor = '#66d2e2';
const changeColor = 'rgb(0, 188, 212)';
export default class NetPyNEMechanismThumbnail extends React.Component {

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

      <IconButton
        className={"gearThumbButton " + (this.props.selected ? "selectedGearButton" : "")}
        onClick={this.handleClick}
      >
        <FontIcon color={changeColor} hoverColor={hoverColor} className="gpt-fullgear" />
        <span className={"gearThumbLabel"}>{this.props.name}</span>
      </IconButton>

    );
  }
}
