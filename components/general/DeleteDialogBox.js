/**
 * Tabbed Drawer resizable component
 * It uses the components DrawerButton and Rnd to create a resizable Tabbed Drawer.
 * 
 *  @author Dario Del Piano
 *  @author Adrian Quintana
 */

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import FlatButton from '@material-ui/core/Button';


export default class DeleteDialogBox extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      open: props.open,
      response: false
    };
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.open != this.props.open) {
      this.setState({ open: this.props.open });
    }
  }
    
  render () {
    const actions = [
      <FlatButton
        id="confirmCancel"
        label="Cancel"
        primary={true}
        onClick={() => this.props.onDialogResponse(false)}
      />,
      <FlatButton
        id="confirmDeletion"
        label="Confirm"
        primary={true}
        keyboardFocused={true}
        onClick={() => this.props.onDialogResponse(true)}
      />,
    ];
    
    return (
      <div>
        <Dialog
          title={"Delete " + this.props.textForDialog}
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}>
          {"Do you want to remove " + this.props.textForDialog + " ?"}
        </Dialog>
      </div>
    );
  }
}
