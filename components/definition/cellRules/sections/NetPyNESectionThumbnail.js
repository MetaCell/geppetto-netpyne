import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import DeleteDialogBox from '../../../general/DeleteDialogBox';


export default class NetPyNESectionThumbnail extends React.Component {

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
  }

  handleClick() {
    if (this.props.handleClick) {
      if(this.props.selected && this.state.isHovered) {
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

  handleDialogBox(response) {
    if(this.props.handleClick && response) {
      this.props.deleteMethod(this.props.name);
    }
    this.setState({dialogOpen: false});
  };

  render() {
    return (
      <div>
      <RaisedButton
        onMouseEnter={this.handleHoverIn}
        onMouseLeave={this.handleHoverOut}
        primary={true} 
        className={"rectangularActionButton " + (this.props.selected ? "selectedRectangularActionButton " : "")} 
        onClick={this.handleClick}>
          {(this.state.isHovered && this.props.selected) ? <FontIcon className="fa fa-trash-o" color="white" hoverColor="white"/> : this.props.name}
      </RaisedButton>
      <DeleteDialogBox
            open={this.state.dialogOpen}
            onDialogResponse={this.handleDialogBox}
            textForDialog={this.props.name} />
      </div>
    );
  }
}
