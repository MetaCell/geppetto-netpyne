import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import DeleteDialogBox from './DeleteDialogBox';

export default class NetPyNEThumbnail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      dialogOpen: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleHoverIn = this.handleHoverIn.bind(this);
    this.handleHoverOut = this.handleHoverOut.bind(this);
    this.handleDialogBox = this.handleDialogBox.bind(this);
  };

  handleClick() {
    if (this.props.handleClick) {
      if (this.props.selected && this.state.isHovered) {
        this.setState({dialogOpen: true});
      } else {
        this.props.handleClick(this.props.name, true);
      }
    }
  };

  handleHoverIn() {
    this.setState({
      isHovered: true
    });
  };

  handleHoverOut() {
    this.setState({
      isHovered: false
    });
  };

  handleDialogBox(response){
    if (this.props.handleClick && response) {
      this.props.deleteMethod(this.props.name);
    }
  }

  render() {
    return (
      <div>
        <FloatingActionButton
          id={this.props.name}
          onMouseEnter={this.handleHoverIn}
          onMouseLeave={this.handleHoverOut}
          iconClassName={(this.state.isHovered && this.props.selected) ? "fa fa-trash-o" : ""}
          className={"actionButton " + (this.props.selected ? "selectedActionButton" : "")}
          onClick={this.handleClick}>
          {(this.state.isHovered && this.props.selected) ? "" : this.props.name}
        </FloatingActionButton>
        <DeleteDialogBox open={this.state.dialogOpen} onDialogResponse={this.handleDialogBox} textForDialog={this.props.name} />
      </div>
    );
  };
};
