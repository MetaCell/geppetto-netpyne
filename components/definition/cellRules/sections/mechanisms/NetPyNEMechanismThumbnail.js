import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import DeleteDialogBox from '../../../../general/DeleteDialogBox';

const hoverColor = '#66d2e2';
const changeColor = 'rgb(0, 188, 212)';
export default class NetPyNEMechanismThumbnail extends React.Component {

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
      <div style={{float: "left"}}>
      <IconButton
        id={"mechThumb"+this.props.name}
        onMouseEnter={this.handleHoverIn}
        onMouseLeave={this.handleHoverOut}
        className={"gearThumbButton " + (this.props.selected ? "selectedGearButton" : "")}
        onClick={this.handleClick}>
          <div>
           {(this.state.isHovered && this.props.selected) ? 
            <FontIcon className="fa fa-trash-o" color="white" hoverColor="white"  style={{zIndex:10,marginTop:37,marginLeft:40,position:"absolute",backgroundColor:"#f23d7a"}}/> :
            <span className={"gearThumbLabel"}> {this.props.name}</span>}
           <FontIcon color={changeColor} hoverColor={hoverColor} className="gpt-fullgear"/>
          </div>
           
      </IconButton>
      <DeleteDialogBox
            open={this.state.dialogOpen}
            onDialogResponse={this.handleDialogBox}
            textForDialog={this.props.name} />
      </div>
    );
  }
}
