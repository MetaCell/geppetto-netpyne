import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';


export default class NetPyNENewSection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };

    this.handleClick = this.handleClick.bind(this);

  }

  handleClick() {
    if (this.props.handleClick) {
      this.props.handleClick({ 'Section': {'geom': {}, 'topol': {}, 'mechs': {}} });
    }
  }

  render() {
    return (

      <RaisedButton primary={true} className={"addRectangularButton"} onClick={this.handleClick}>
        <ContentAdd />
      </RaisedButton>


    );
  }
}
