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
    this.handleDialogBox = this.handleDialogBox.bind(this);
  };

  handleClick() {
    if (this.props.handleClick) {
      if(this.props.selected && this.state.isHovered) {
        this.setState({dialogOpen: true});
      } else {
        this.props.handleClick(this.props.name, true);
      }
    }
  };

  handleDialogBox(response) {
    if(this.props.handleClick && response) {
      this.props.deleteMethod(this.props.name);
    }
    this.setState({dialogOpen: false});
  }

  render() {
			const { name, selected } = this.props;
			const { dialogOpen, isHovered } = this.state;
      return (
        <div>
          <FloatingActionButton 
            id={name}
            onMouseEnter={() => this.setState({isHovered: true})}
						onMouseLeave={() => this.setState({isHovered: false})}
						data-tooltip={isHovered && name.length > 14 ? name : undefined}
            iconClassName={(this.state.isHovered && selected) ? "fa fa-trash-o" : ""} 
            className={"actionButton " + (selected ? "selectedActionButton" : "")} 
            onClick={()=>this.handleClick()}
					>
            {isHovered && selected ? "" : name.length > 14 ? name.slice(0,11)+"...": name}
          </FloatingActionButton>
          <DeleteDialogBox
            open={dialogOpen}
            onDialogResponse={this.handleDialogBox}
            textForDialog={name} />
        </div>
      );
  };
};
