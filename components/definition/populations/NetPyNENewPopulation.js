import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

export default class NetPyNENewPopulation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };

    this.handleClick = this.handleClick.bind(this);

  }

  handleClick() {
    if (this.props.handleClick) {
      this.props.handleClick({ 'Population': { 'cellModel': '', 'cellType': '' } });
    }
  }

  render() {
    return (

      <FloatingActionButton id={"newPopulationButton"} mini={true} style={{ margin: 10, float: 'left' }} onClick={this.handleClick}>
        <ContentAdd />
      </FloatingActionButton>


    );
  }
}
