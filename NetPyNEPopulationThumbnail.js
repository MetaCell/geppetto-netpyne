import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export default class NetPyNEPopulation extends React.Component {

  constructor(props) {
    super(props); 
    this.state = {
      model: props.model
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    if (this.props.handleClick){
      this.props.handleClick(this.state.model);
    }
  }

  render() {
    return (

    <FloatingActionButton className={"populationButton " +(this.props.selected?"selectedPop":"")} onClick={this.handleClick}>
       {this.state.model.name}
    </FloatingActionButton>

    );
  }
}
