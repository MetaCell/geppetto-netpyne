import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import FontIcon from '@material-ui/core/Icon';

const hoverColor = '#66d2e2';
const changeColor = 'rgb(0, 188, 212)';

export default class NetPyNEPlotThumbnail extends React.Component {
  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    this.props.handleClick(this.props.name);
  }

  render () {
    return (
      <IconButton
        className={"gearThumbButton " + (this.props.selected ? "selectedGearButton" : "")}
        onClick={this.handleClick}
      >
        <FontIcon style={{ color: changeColor, '&:hover': { color: hoverColor } }} className="gpt-fullgear" />
        <span className={"gearThumbLabel"}>{this.props.name}</span>
      </IconButton>
    );
  }
}
