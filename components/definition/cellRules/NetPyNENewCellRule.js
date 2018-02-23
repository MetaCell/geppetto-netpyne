import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const styles = {
  addButton: {
    margin: 10,
    float: 'left'
  }
};

export default class NetPyNENewCellRule extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };

    this.handleClick = this.handleClick.bind(this);

  }

  handleClick() {
    if (this.props.handleClick) {
      this.props.handleClick({ 'CellRule': {'conds':{}, 'secs':{}} });
    }
  }

  render() {
    return (

      <FloatingActionButton mini={true} style={styles.addButton} onClick={this.handleClick}>
        <ContentAdd />
      </FloatingActionButton>


    );
  }
}
