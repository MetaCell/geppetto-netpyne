import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import DeleteDialogBox from '../../../general/DeleteDialogBox';

const styles = {
  btn: {
    borderRadius: '25px'
  }
};

export default class NetPyNESectionThumbnail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      dialogOpen: false
    };
  };

  handleClick() {
    const { isHovered } = this.state;
    const { name, handleClick, selected } = this.props;
    if (handleClick) {
      selected && isHovered ? this.setState({dialogOpen: true}) : handleClick(name, true);
      }
  };

  handleDialogBox(response) {
    const { name, handleClick, deleteMethod } = this.props;
    if (handleClick && response) {
      deleteMethod(name);
    }
    this.setState({dialogOpen: false});
  };

  render() {
    const { name, selected } = this.props;
    const { isHovered, dialogOpen } = this.state;

    let label;
    if (isHovered && selected) {
      label = <FontIcon className="fa fa-trash-o" color="white" hoverColor="white"/> 
    }
    else {
      label = name.length > 14 ? `${name.slice(0,10)}...` : name
    }
    return (
      <div>
      <RaisedButton
        id={name}
        primary={true} 
        style={ styles.btn }
        buttonStyle={ styles.btn }
        onMouseEnter={ () => this.setState({isHovered: true}) }
        onMouseLeave={ () => this.setState({isHovered: false}) }
        data-tooltip={isHovered && name.length > 14 ? name : undefined}
        className={"rectangularActionButton " + (selected ? "selectedRectangularActionButton " : "")} 
        onClick={() => this.handleClick()}
      >
        { label }
      </RaisedButton>
      <DeleteDialogBox
            open={dialogOpen}
            onDialogResponse={ r => this.handleDialogBox(r) }
            textForDialog={name} />
      </div>
    );
  }
}
