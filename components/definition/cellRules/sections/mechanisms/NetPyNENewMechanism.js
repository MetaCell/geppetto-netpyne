import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FontIcon from 'material-ui/FontIcon';

const hoverColor = '#66d2e2';
const changeColor = 'rgb(0, 188, 212)';

export default class NetPyNENewMechanism extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };

    this.handleClick = this.handleClick.bind(this);

  }

  handleClick() {
    if (this.props.handleClick) {
      this.props.handleClick({ 'Mechanism': { 'gnabar': {}, 'gkbar': {} } });
    }
  }

  render() {
    return (
      <IconButton
        iconStyle={{ width: 44, height: 44 }}
        className={"gearAddButton"}
        onClick={this.handleClick}
      >
        <FontIcon color={changeColor} hoverColor={hoverColor} className="gpt-fullgear" />
        <ContentAdd />
      </IconButton>
    );
  }
}
