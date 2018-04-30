import React, { Component } from 'react';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export default class NetPyNEAddNew extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleClick = this.handleClick.bind(this);
  };

  handleClick() {
    if (this.props.handleClick) {
      this.props.handleClick();
    };
  };

  render() {
    var content = (
      <FloatingActionButton id={this.props.id} mini={true} style={{ margin: 10, float: 'left' }} onClick={this.handleClick}>
        <ContentAdd />
      </FloatingActionButton>
    );
    
    return content;
  };
};
