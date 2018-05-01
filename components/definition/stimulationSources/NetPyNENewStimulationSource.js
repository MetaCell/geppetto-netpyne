import React, { Component } from 'react';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const styles = {
  addButton: {
    margin: 10,
    float: 'left'
  }
};

export default class NetPyNENewStimulationSource extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleClick = this.handleClick.bind(this);
  };

  handleClick() {
    if (this.props.handleClick) {
      this.props.handleClick({ 'Source': {
        'type': '', 'del': 0, 'dur': 0, 'amp': ''}});
    };
  };

  render() {
    var content = (
      <FloatingActionButton mini={true} style={styles.addButton} onClick={this.handleClick}>
        <ContentAdd />
      </FloatingActionButton>
    );
    
    return content;
  };
};
